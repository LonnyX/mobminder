
import { writeLog,LogLevel,callfetch,fileToBase64 } from './utils.js';
import OpenAI from 'openai';

const internalerror = 'A programmatic error occurred in the tool';


export function addToolsToOpenAi(openai,lgn,pwd,kid,requestid,clientws,getcurrentpicture,logdate) {

	// 1 // get_local_date_time //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    openai.addTool(
        {
			name: 'get_local_date_time',
			description:
				'Returns the current local date/time in [YYYY-MM-DD weekday HH:MM] format, optionally adjusted by days, hours, or weeks.\n' +
				'Use increments (incdays,inchours,incweeks) to obtain past or future dates (e.g., yesterday = incdays = -1, two weeks ahead = incweeks = 2).\n' +
				'Examples:\n' +
				'- To find the next planned to start C_dS_reservation instance, get today\'s date/time, then compare with \'get_planning\' results.\n' +
				'- For finding availabilities two weeks from now, call this tool with incweeks=2, then pass the returned date to \'search_availabilities\'.',
			parameters: {
				type: 'object',
				properties: {
				  incdays: {
					type: 'integer',
					description:
					  'Adjusts the current date by the given number of days (positive = future, negative = past).\n' +
					  'Examples:\n'+
					  'incdays = -1 gives you yesterday.\n'+
					  'incdays = 1 gives you tomorrow.\n'
				  },
				  inchours: {
					type: 'integer',
					description:
					  'Adjusts the current time by the given number of hours (positive = future, negative = past).\n' +
					  'Example: inchours = 3 gives you 3 hours from now.'
				  },
				  incweeks: {
					type: 'integer',
					description:
					  'Adjusts the current date by the given number of weeks (positive = future, negative = past).\n' +
					  'Example: incweeks = 2 gives you two weeks from now.'
				  }
				},
				required: []
            }
    
        },
        async({ incdays = 0, inchours = 0, incweeks = 0 }) => { 
            try
            {
                let url = 'https://ai.mobminder.com/query/datetimelocation.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                if(incdays) params.append('incdays', incdays);
                if(inchours) params.append('inchours', inchours);
                if(incweeks) params.append('incweeks', incweeks);
                
                let response = await callfetch(logdate,url,params,requestid,false);
                return response;
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );


	// 2 // get_planning //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	const pickdate = (datetime) => { // 0, undefined or anything starting with YYYY-MM-DD, e.g. [YYYY-MM-DD weekday HH:MM]
		
		const defaultdate = () =>
		{ // Edge case
			const today = new Date(); // Get current system date
			const date = today.toISOString().split('T')[0]; // Extract YYYY-MM-DD
			return date;
		}
		
		if(datetime==0 || datetime==undefined) return defaultdate();
		
		// Step 1: Extract the first 10 characters (YYYY-MM-DD)
		const extractedDate = datetime.substring(0, 10); // "2024-02-07"

		// Step 2: Validate the format YYYY-MM-DD
		const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(extractedDate);

		// Step 3: Ensure numeric values are actually numbers
		const [year, month, day] = extractedDate.split('-').map(Number);
		const isNumeric = !isNaN(year) && !isNaN(month) && !isNaN(day);

		if(isValidDate && isNumeric) return extractedDate;
		else return defaultdate();
	};
	
    openai.addTool(
        {
			name: 'get_planning',
			description:
				'This tool returns a list of C_dS_reservation instances for a specified date and C_dS_resource.\n' +
				// '� On request to OPEN the planning, call this tool and ask afterwards what the user\'s enquiry is.\n' +
				// '� Read the returned planning items only if READING is requested upfront.\n' +
				// '� On request to FIND A VISITOR from the planning, ask the user for firstname or lastname, and pick the right appointment from the planning.\n' +
				'All returned C_dS_reservation instances have positive id\'s.\n' +
				'If the user wants to know about previously deleted C_dS_reservation, set the optional parameter \'deleted\' to 1.',
			parameters: {
			type: 'object',
			properties: {
			  resourceid: {
				type: 'integer',
				description:
				  'Mandatory. A valid C_dS_resource->id picked from available C_dS_resource instances in this account.\n' +
				  'Unless otherwise specified by the user, use the primary C_dS_resource.\n' +
				  'If the user names a different C_dS_resource, deduce its C_dS_resource->id from that name.\n'
			  },
			  date: {
				type: 'string',
				description: 'Optional. Day in format YYYY-MM-DD. Defaults to current calendar date.'
			  },
			  part: {
				type: 'integer',
				enum: [-2, -1, 0, 1, 2],
				description:
				  'Option to query a part of the planning on the specified day. This parameter is optional and defaults to 0.\n' +
				  '� Leave part=0 or omit this parameter to return the full list of written C_dS_reservation instances. Best option for finding a visitor who is supposed to appear on the day planning.\n' +
				  '� Set part=1 to query only C_dS_reservation instances that are visible in the MORNING.\n' +
				  '� Set part=2 to query only C_dS_reservation instances that are visible in the AFTERNOON.\n' +
				  '� Set part=-1 to query the ONGOING C_dS_reservation instance. Mandatory: when you pass part=-1, you must omit the date parameter.\n' +
				  '� Set part=-2 to query the NEXT TO START C_dS_reservation instance. Mandatory: when you pass part=-2, you must omit the date parameter.'
			  },
			  cancelled: {
				type: 'integer',
				enum: [0, 1],
				description:
				  'Allows to read cancelled C_dS_reservation instances. Optional, defaults to 0.\n' +
				  '� Leave cancelled=0 or omit this parameter to return only active (non-cancelled) C_dS_reservation instances.\n' +
				  '� Set cancelled=1 to query only cancelled C_dS_reservation instances.\n'
			  }
			},
			required: ['resourceid']
            }
        },
        async({ resourceid, date = 0, part = 0, cancelled = 0 }) => { 
            try
            {
                let url = 'https://ai.mobminder.com/query/planning.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                params.append('days', 1);
                params.append('rscids', resourceid);
                if(date) params.append('from', date);
                if(part) params.append('part', part);
                if(cancelled) params.append('cancelled', cancelled);

				writeLog(logdate,'Sending command to smartphone: DoPlanningCheckSum + closedrawer + date = '+date,requestid,LogLevel.warning);
   				// clientws.send(JSON.stringify({ status:'DoPlanningCheckSum', date:pickdate(date), closedrawer:true })); // date:'YYYY-MM-DD'
				clientws.send( JSON.stringify({ status:'Ok', actions: { goToDate:pickdate(date), closeDrawer:1 }}) );

                let response = await callfetch(logdate,url,params,requestid,false);
				
                return response;
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );
    

	// 3 // search_availabilities //////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    openai.addTool(
        {
			name: 'search_availabilities', // 1024 bytes max/description

			description:
			  'This tool returns a list of C_dS_availability items found from the given date onward in a specified C_dS_resource (agenda).\n' +
			  'Before calling, always ask the user which workcode to look up (each has its own duration and preferred day period).\n' +
			  'Help the user select a workcode by listing available C_dS_workcode items.\n' +
			  'Present returned items one by one with a 2 seconds pause for reflection. Report only cueIn (weekday, date, start time, end time).\n' +
			  'Continue listing until the user selects one C_dS_availability or abandons the process. Then remember the selected C_dS_availability->id for further usage.\n' +
			  'Offer to create a C_dS_reservation in the selected time slot,\n' +
			  'a C_dS_availability can be converted into a C_dS_reservation by using the \'save_reservation\' tool.',

			parameters: {
			  type: 'object',
			  properties: {
				date: {
				  type: 'string',
				  description:
					'Mandatory. The date from which to start searching the calendar, in ISO 8601 format (YYYY-MM-DD).\n' +
					'This date must be today or in the future.'
				},
				workcode: {
				  type: 'integer',
				  description:
					'Mandatory. Must be one of available C_dS_workcode->id\'s. Please confirm with the user which workcode to use.\n' +
					'If you are asked to list C_dS_workcode items, report only these fields unless otherwise requested: [C_dS_workcode->name, C_dS_workcode->duration].'
				},
				resourceid: {
				  type: 'integer',
				  description:
					'Mandatory. Is a C_dS_resource->id (agenda) taken from available C_dS_resource->id\'s.\n' +
					'Unless the user specifies otherwise, default to the primary C_dS_resource->id stated in your role (CONTEXT description).\n' +
					'If the user names another C_dS_resource, match it to the correct C_dS_resource->id. '
				},
				lookupmode: {
				  type: 'integer',
				  enum: [0, 1, 2, 3],
				  description:
					'Optional. Defines how to search for availabilities in the calendar.\n' +
					'Modes 1, 2, and 3 optimize scheduling by suggesting slots adjacent to existing reservations. The default is mode 3.\n' +
					'0: Sequential scan of all possible time slots that match the C_dS_workcode. ' +
					'Best if the user wants more availability options inside the same day. Then call this tool again with the same date and lookupmode=0.\n' +
					'1: Picks availabilities adjacent to an existing reservation, or the soonest slot if the day is clear.\n' +
					'2: Picks availabilities adjacent to an existing reservation, or the latest slot if the day is clear.\n' +
					'3: Picks availabilities adjacent to an existing reservation, or both the soonest and latest available slots if the day is clear.'
				}
			  },
			  required: ['date', 'workcode', 'resourceid']
			}
		},
        async({ date, workcode, resourceid, lookupmode = 3 }) => { 
            try
            {
                let url = 'https://ai.mobminder.com/query/availabilities.php';
                let limit = 1; if(lookupmode) limit = 4; // limit gives the number of different days that should be scanned (days = those days having availabilities, they might not be sequential on the calendar)
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                params.append('date', date);
                params.append('workcode', workcode);
                params.append('limit', limit);
                params.append('bCals', resourceid);
                if(lookupmode) params.append('aggregate', lookupmode);
				
				const cleandate = pickdate(date); // YYYY-MM-DD format, defaults to today if the input string is not well formatted.
				writeLog(logdate,'Sending command to smartphone: DoPlanningCheckSum + closedrawer + date = '+cleandate,requestid,LogLevel.warning);
   				// clientws.send(JSON.stringify({ status:'DoPlanningCheckSum', date:cleandate, closedrawer:true }));
				clientws.send(JSON.stringify({ status:'Ok', actions: { goToDate:cleandate, closeDrawer:1 }}));
                
                let response = await callfetch(logdate,url,params,requestid,false);
                return response;
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );
    

	// 4 // lookup_visitors //////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    openai.addTool(
        {
			name: 'lookup_visitors',
			description:
			  'Returns a list of C_dS_visitor records matching the given lookup criteria. ' +
			  'Use exactly 1 or 2 criteria per call (not more, not less).\n' +
			  'If the user is searching for a visitor already obtained from a previous \'get_planning\' call, use that existing data. Do not call this tool unnecessarily.\n' +
			  'If needed, you can call this tool repeatedly, refining the search criteria through user interaction, until you arrive at a single C_dS_visitor that the user confirms.\n' +
			  'Tips for efficient lookup:\n' +
			  '� Start with firstname to retrieve an initial list. If spelling is uncertain, ask the user to confirm.\n' +
			  '� If more than 5 items are returned, suggest adding another criterion (e.g. birthday, city, or lastname).\n' +
			  '� Birthday and city typically yield better results than lastname.\n' +
			  '� If fewer than 6 items are returned, list them so the user can choose the correct entry.\n' +
			  '� After four unsuccessful attempts to narrow down the search, ask the user if this might be a NEW visitor.',
			parameters: {
			  type: 'object',
			  properties: {
				firstname: {
				  type: 'string',
				  description:
					'The visitor�s firstname or partial firstname. Minimum 3 letters.\n' +
					'SQL equivalent example: SELECT * FROM visitors WHERE firstname LIKE "%letters%", notice the wildcard %.\n' +
					'A partial match returns any firstname containing that substring.\n' +
					'Examples:\n' +
					'� If the user clearly says "Philippe," enter "philippe". This will match "Philippe", "Jean-Philippe," or "Philippe-Henry," etc.\n' +
					'� If the user spells out "m", "o", "n," you can enter "mon", which might match "Simon", "Monique", "Raymond" etc.'
				},
				lastname: {
				  type: 'string',
				  description:
					'The visitor�s lastname or partial lastname. Minimum 4 letters.\n' +
					'SQL equivalent example: SELECT * FROM visitors WHERE lastname LIKE "%letters%", notice the wildcard %.\n' +
					'Examples:\n' +
					'� If you heard "neuve" entering "neuve" could match "de Villeneuve" Any part of the lastname is sufficient.\n' +
					'� If the user spells "c", "a", "p", "r", "i," you can enter "capri" and find matches like "DiCaprio" or "Capricosy.".'
				},
				birthday: {
				  type: 'integer',
				  description:
					'The visitor�s birthdate in one of these formats: YYYYMMDD, YYYYMM, or YYYY.\n' +
					'Examples:\n' +
					'� If the user only knows the birth year, pass "YYYY".\n' +
					'� If they know year and month, use "YYYYMM".\n' +
					'� If they know the full date, use "YYYYMMDD".'
				},
				city: {
				  type: 'string',
				  description:
					'City where the visitor lives. A partial name is allowed, minimum 4 letters.\n' +
					'SQL equivalent example: SELECT * FROM visitors WHERE city LIKE "%letters%".'
				},
				gender: {
				  type: 'integer',
				  enum: [0, 1],
				  description:
					'Gender of the visitor: 1 for male, 0 for female. Only use this if the user explicitly mentioned the visitor�s gender.\n' +
					'Do NOT combine gender with firstname if the user already spelled the firstname (that usually implies gender).\n' +
					'If the user did not mention gender, leave this parameter out.\n' +
					'By default, if gender is not provided, no filter is applied based on gender.'
				}
			  },
			  required: []
            }
        },
        async({ firstname = '', lastname = '', birthday = 0, city = '', gender = -1 }) => {
            try
            {
                let url = 'https://ai.mobminder.com/query/visitors.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                if(firstname) params.append('firstname', firstname);
                if(lastname) params.append('lastname', lastname);
                if(birthday) params.append('birthday', birthday);
                if(city) params.append('city', city);
                if(gender>-1) params.append('gender', gender);
                // if(phoneormobile) params.append('phoneormobile', phoneormobile);
                
        
                let response = await callfetch(logdate,url,params,requestid,false);
                return response;
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );
    

	// 5 // save_private_time_reservation ////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    openai.addTool(
        {
		name: 'save_private_time_reservation',
			description:
			  'This tool creates or updates in the specified agenda(s) a C_dS_reservation, without visitor, and returns the updated data.\n' +
			  'Typical use cases:\n' +
			  '� The user wants to write a simple note on their planning.\n' +
			  '� Converting a C_dS_availability into a private time C_dS_reservation.\n' +
			  '� Editing an existing private time reservation start time, end time, or note.\n' +
			  '� Writing a new private time reservation (based on user\'s date and time specifications).\n' +
			  'The tool response will warn you and ask for confirmation in case of overbooking.\n' +
			  'Always ask if a note should be written.\n'
			  ,
			parameters: {
			  type: 'object',
			  properties: {
					id: {
					  type: 'integer',
					  description:
						'Must be either [0, C_dS_reservation->id, C_dS_availability->id], no other value is authorized.\n' +
						'Examples:\n' +
						'� Pass id=0 to create a NEW time reservation (you must then provide cueIn and cueOut, check with the user).' +
						'� Pass a C_dS_reservation->id to modify an existing reservation. The user must specify which one to modify.\n' +
						'� Pass a C_dS_availability->id to convert a C_dS_availability into a private time C_dS_reservation instance.\n' +
						'IMPORTANT: Never pass "undefined" here.'
					},
					cueIn: {
					  type: 'string',
					  description:
						'Start time of the reservation in "YYYY-MM-DD weekday HH:MM" format (weekday is optional).\n' +
						'For NEW reservations (id = 0), cueIn and cueOut are mandatory, ask the user.' +
						'For an existing reservation (id > 0), re-use C_dS_reservation->cueIn, specifying a new cueIn will shift the start time.\n' +
						'When converting a C_dS_availability, use C_dS_availability->cueIn.\n'
					},
					cueOut: {
					  type: 'string',
					  description:
						'End time of the reservation in "YYYY-MM-DD weekday HH:MM" format (weekday is optional).\n' +
						'For NEW reservations (id = 0), cueOut and cueIn are mandatory, ask the user.' +
						'For an existing reservation (id > 0), re-use C_dS_reservation->cueOut, specifying a new cueOut will change the duration.\n' +
						'When converting a C_dS_availability, use C_dS_availability->cueOut.\n'
					},
					resourceIds: {
					  type: 'string',
					  description:
						'One or more C_dS_resource->id\'s, separated by commas, e.g. "21304,21306".\n' +
						'At least one resource id is required. If the user wants to write to multiple agendas, pass them in a comma-separated string.'
					},
					note: {
					  type: 'string',
					  description:
						'An optional note attached to this C_dS_reservation.\n' +
						'For an existing reservation, include this only if the user wants to replace or append text,' +
						'otherwise, omit it to leave the old note unchanged.\n'
					},
					confirmed: {
					  type: 'integer',
					  enum: [0, 1],
					  description:
						'Optional. If this tool response indicates that confirmation is needed (eg: overbooking), ask the user for approval.' +
						'If the user confirms, call again \'save_private_time_reservation\' with identical input parameters plus confirmed=1.\n' +
						'If the user cancels, abandon this scenario and report the cancellation.\n'
					}
				  },
			  required: ['id', 'cueIn', 'cueOut', 'resourceIds']
			  }
        },
        async({ id, cueIn, cueOut, resourceIds, note = '', confirmed = 0 }) => {
            try
            {
				if(id===undefined) id=0;
                let url = 'https://ai.mobminder.com/post/reservation.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                params.append('id', id);
                params.append('cueIn', cueIn);
                params.append('cueOut', cueOut);
                params.append('bCals', resourceIds);
                if(note) params.append('note', note);
                if(confirmed) params.append('confirmed', confirmed);
                
                let response = await callfetch(logdate,url,params,requestid,false);
				
				const cleandate = pickdate(cueIn); // YYYY-MM-DD format, defaults to today if the input string is not well formatted.
				writeLog(logdate,'Sending command to smartphone: DoPlanningCheckSum + closedrawer + date = '+cleandate,requestid,LogLevel.warning);
   				// clientws.send(JSON.stringify({ status:'DoPlanningCheckSum', date:cleandate, closedrawer:true }));
				clientws.send(JSON.stringify({ status:'Ok', actions: { goToDate:cleandate, closeDrawer:1, refreshCache:1, refreshOffDays:1 }}));
				
                return response;
				
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );
    
	
	// 6 // save_appointment ////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    openai.addTool(
        {
		name: 'save_appointment',
			description:
			  'This tool creates or updates a C_dS_reservation involving a visitor in the specified agenda(s) and returns the updated data.\n' +
			  'Typical use cases:\n' +
			  '� Converting a C_dS_availability into a C_dS_reservation.\n' +
			  '� Editing an existing appointment time, note, visitors, or workcodes.\n' +
			  '� Writing a brand new appointment (not based on availability) according to user specifications.\n' +
			  'The tool response will warn you and ask for confirmation in case of overbooking.\n' +
			  'Always ask if a note should be written.\n'
			  ,
			parameters: {
			  type: 'object',
			  properties: {
					id: {
					  type: 'integer',
					  description:
						'Must be either [0, C_dS_reservation->id, C_dS_availability->id], no other value is authorized.\n' +
						'Examples:\n' +
						'� Pass id=0 to create a new appointment (you must then provide cueIn and cueOut, check with the user).' +
						'� Pass a C_dS_reservation->id to modify an existing appointment. The user must specify which one to modify.\n' +
						'� Pass a C_dS_availability->id to convert a C_dS_availability into a private time C_dS_reservation instance.\n' +
						'IMPORTANT: Never pass "undefined" here.'
					},
					cueIn: {
					  type: 'string',
					  description:
						'Start time of the appointment in "YYYY-MM-DD weekday HH:MM" format (weekday is optional).\n' +
						'For NEW reservations (id = 0), cueIn is mandatory.\n' +
						'For an existing appointment (id > 0), re-use C_dS_reservation->cueIn, specifying a new cueIn will shift the start time.\n' +
						'When converting a C_dS_availability, use C_dS_availability->cueIn.'
					},
					cueOut: {
					  type: 'string',
					  description:
						'End time of the appointment in "YYYY-MM-DD weekday HH:MM" format (weekday is optional).\n' +
						'For NEW reservations (id = 0), cueOut is mandatory.\n' +
						'For an existing appointment (id > 0), re-use C_dS_reservation->cueOut, specifying a new cueOut will change the duration.\n' +
						'When converting a C_dS_availability, use C_dS_availability->cueOut.\n'
					},
					resourceIds: {
					  type: 'string',
					  description:
						'One or more C_dS_resource->id\'s, separated by commas, e.g. "21304,21306".\n' +
						'At least one resource id is required. If the user wants to write to multiple agendas, pass them in a comma-separated string.'
					},
					note: {
					  type: 'string',
					  description:
						'An optional note attached to this C_dS_reservation.\n' +
						'For an existing appointment, include this only if the user wants to replace or append text,' +
						'otherwise, omit it to leave the old note unchanged.'
					},
					visitorIds: {
					  type: 'string',
					  description:
						'One or more C_dS_visitor->id\'s, separated by commas.\n' +
						'If the user wants to invite multiple visitors, pass them all in a comma-separated string, e.g. "11175728,11172507".'
					},
					workcodeIds: {
					  type: 'string',
					  description:
						'This parameter applies only for accounts having C_dS_workcode\'s. If so:\n' +
						'One or more C_dS_workcode->id\'s, separated by commas, e.g. "42789,52456".\n' +
						'If no workcode was mentioned so far by the user, confirm whether the user wants to attach any.'
					},
					confirmed: {
					  type: 'integer',
					  enum: [0, 1],
					  description:
						'Optional. If this tool response indicates that confirmation is needed (e.g. overbooking), ask the user for approval.' +
						'If the user confirms, call again \'save_appointment\' with identical input parameters plus confirmed=1.\n' +
						'If the user cancels, abandon this scenario and report the cancellation.\n'
					}
				},
			  required: ['id', 'cueIn', 'cueOut', 'resourceIds', 'visitorIds']
			  }
        },
        async({ id, cueIn, cueOut, resourceIds, visitorIds, note = '', workcodeIds = '', confirmed = 0 }) => {
            try
            {
                let url = 'https://ai.mobminder.com/post/reservation.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                params.append('id', id);
                params.append('cueIn', cueIn);
                params.append('cueOut', cueOut);
                params.append('bCals', resourceIds);
                params.append('visitors', visitorIds);
                if(note) params.append('note', note);
                if(workcodeIds) params.append('workcodes', workcodeIds);
                if(confirmed) params.append('confirmed', confirmed);
                
                let response = await callfetch(logdate,url,params,requestid,false);
				
				const cleandate = pickdate(cueIn); // YYYY-MM-DD format, defaults to today if the input string is not well formatted.
				writeLog(logdate,'Sending command to smartphone: DoPlanningCheckSum + closedrawer + date = '+cleandate,requestid,LogLevel.warning);
   				// clientws.send(JSON.stringify({ status:'DoPlanningCheckSum', date:cleandate, closedrawer:true }));
				clientws.send(JSON.stringify({ status:'Ok', actions: { goToDate:cleandate, closeDrawer:1, refreshCache:1, refreshOffDays:1 }}));
				
                return response;
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );
    
 
	// 7 // register_off_days //////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    openai.addTool(
        {
			name: 'register_off_days',
			description:'This tool records in the specified agenda (C_dS_resource->id) either a single full-day event or multiple off days, and returns the updated and related data.\n',
			parameters: {
				type: 'object',
				properties: {
					dateIn: {
					  type: 'string',
					  description: 'Start date in the format "YYYY-MM-DD".\n'
					},
					resourceIds: {
					  type: 'string',
					  description:
						'One or more C_dS_resource->id\'s, At least one id is required.\n' +
						'For multi-resource accounts, use the default C_dS_resource unless the user specifically requests otherwise.\n' +
						'If the user asks to involve two or more agendas, pass the id\'s in a comma-separated string, e.g. "21304,21306,21314".'
					},
					dateOut: {
					  type: 'string',
					  description:
						'End date in the format "YYYY-MM-DD". If you are recording just a single off-day event, dateOut can be omitted.\n'
					},
					note: {
					  type: 'string',
					  description:
						'An optional note attached to this C_dS_reservation.\n' +
						'For an existing calendar event (id>0), include a note only if the user wants to replace or append text,' +
						'otherwise, omit note to leave the old note unchanged.'
					},
					confirmed: {
					  type: 'integer',
					  enum: [0, 1],
					  description:
						'Optional. If this tool output requests user confirmation, please ask for it. The tool may provide a reason for confirmation.\n' +
						'� If the user confirms, call this "register_off_days" tool again with the same parameters but set confirmed to 1.\n' +
						'� If the user cancels or does not confirm, abandon the scenario and report it as canceled.'
					},
					id: {
					  type: 'integer',
					  description:
						'Can be either [0 or an existing C_dS_reservation->id], no other value is authorized.\n' +
						'Examples:' +
						'� Pass id=0 or omit id to create a new full-day(s) reservation.' +
						'� Pass an existing C_dS_reservation->id to modify an existing event. The user must have specified which one to modify.\n' +
						'IMPORTANT: Never pass "undefined" here.'
					},
				},
				required: ['dateIn', 'resourceIds']
			}
        },
        async({ dateIn, resourceIds, dateOut = 0, note = '', confirmed = 0, id = 0 }) => {
            try
            {
                let url = 'https://ai.mobminder.com/post/reservation.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                params.append('id', id);
                params.append('cueIn', dateIn);
                params.append('bCals', resourceIds);
                if(dateOut) params.append('cueOut', dateOut);
                if(note) params.append('note', note);
                if(confirmed) params.append('confirmed', confirmed);
                
        
                let response = await callfetch(logdate,url,params,requestid,false);

				const cleandate = pickdate(dateIn); // YYYY-MM-DD format, defaults to today if the input string is not well formatted.
				writeLog(logdate,'Sending command to smartphone: DoOffdaysCheckSum + closedrawer + date = '+cleandate,requestid,LogLevel.warning);
   				// clientws.send(JSON.stringify({ status:'DoOffdaysCheckSum', date:cleandate, closedrawer:true }));
				clientws.send(JSON.stringify({ status:'Ok', actions: { goToDate:cleandate, closeDrawer:1, refreshCache:1, refreshOffDays:1 }}));
				
                return response;
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );


	// 8 // send_sms_or_email //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	openai.addTool(
		{
			name: 'send_sms_or_email',
			description:'This tool sends an email or an SMS.\n'
				+' Always confirm with the user what reference [C_dS_visitor or C_dS_collaborator] to address the message to.\n'
				+' Always stick to the user\'s selected [C_dS_visitor or C_dS_collaborator] instance, you never select another class or id without the user consent.\n'
				+' Double-check that the id you pass exists in the chosen addresseeclass of <data> instances.\n'
				+' When you have all parameters ready, ask the user a final confirmation then actually send the message.\n'
			,
			parameters: {
				type: 'object',
				properties: { // these are the parameters that we need to collect input to curl our servers
					// id: {
						// type: 'integer',
						// description: ' When a brand new C_dS_reservation should be recorded, then use id = 0.\n'
							// + 'When an existing C_dS_reservation must be modified, use its existing positive id as input.\n'
							// + 'When a C_dS_reservation must be created from a C_dS_availability, use the negative C_dS_availability id as input.\n'
					// },
					channel: { 
						type: 'integer',
						enum: [0, 1],
						description: 'Set to 0 for emails. Set to 1 for SMS.\n'
					},
					addresseeclass: {
							type: 'string',
							enum: ['C_dS_visitor', 'C_dS_collaborator'],
							description: 'use \'C_dS_visitor\' if the user messages a visitor, use \'C_dS_collaborator\' if the user messages themselves or a colleague.\n'
					},
					addresseeid: { 
						type: 'integer',
						description: 'id of the message addressee. Is either a user selected C_dS_visitor->id or a user selected C_dS_collaborator->id, aligning with specified addresseeclass\n'
							+' In some cases, the user might want to send a message to themselves. If so, use the user\'s C_dS_collaborator->id.\n'
							+' In case the user wants to send a message to a colleague, use the user selected C_dS_collaborator.\n'
					},
					message: {
						type: 'string',
						description: 'The message to be communicated.\n'
							+'Unless otherwise specified by the user, sign the message with user name for SMS. For emails, sign the message with user name and C_dS_account name.\n'
							+'� For channel 1 (sms) limit the text to maximum 400 characters.\n'
							+'� For channel 0 (email) limit the text to 300 words + a possible HTML layout.\n'
							+'Email formating:'
							+'� Planning data is presented in a structured way when wrote into an email, not into a long sentence.\n'
							+'� When presenting structured data in an email, you can make use of basic HTML tags like [<div>, <p>, <span>, <a>, <img>, <table>, <tr>, <td>, <th>, <ul>, <ol>, <li>].\n'
							+'� Emails only support inline styles: <span style="color:red; font-size:14px;"> is an example. Use colors and text size for emphasis.\n'
							+'� Rely on HTML table-based layouts for structure.\n'
					},
					title: {
						type: 'string',
						description: 'Not applicable for SMS messages.\n'
						+'Mandatory for emails:\n'
						+'Unless the user specified a custom email title, you synthesize the content of the message to create a title with a maximum of 12 words.\n'
						+'No HTML is allowed in an email title, plain text only.\n'
					}
				},
				required: ['channel','addresseeclass','addresseeid','message'],
				requiresConfirmation: true
			}
		},
		async({ channel, addresseeclass, addresseeid, message, title = '' }) => {

            try
            {
				let url = 'https://ai.mobminder.com/post/message.php';

				const params = new URLSearchParams();
				params.append('web', 0);
				params.append('lgn', lgn);
				params.append('pwd', pwd);
				params.append('kid', kid);
				params.append('channel', channel);
				params.append('addresseeclass', addresseeclass);
				params.append('addresseeid', addresseeid);
				params.append('message', message);
				if(title) params.append('title', title);

				let response = await callfetch(logdate,url,params,requestid,false);
				return response;
			} catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
		}
	);


	// 9 // basic_calculator //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	openai.addTool(
		{
			name: 'basic_calculator',
			description: 'Perform basic arithmetic operations on two operands: +, -, *, /, ^\n'
				+ 'Usage: Call this tool when you need to compute a numeric operation with two numbers.\nOperation must be one of: +, -, *, /, ^.\n'
				+' Example usage: { \'operation\': \'^\', \'operand1\': 2, \'operand2\': 3 }, 2 to the power 3 is 8.',
			parameters: {
				type: 'object',
				properties: {
					operation: {
						type: 'string',
						enum: ['+', '-', '*', '/', '^'],
						description: 'The operation to perform'
					},
					operand1: {
						type: 'number',
						description: 'The first operand'
					},
					operand2: {
						type: 'number',
						description: 'The second operand'
					}
				},
				required: ['operation', 'operand1', 'operand2']
			}
		},
		async({ operation, operand1, operand2 }) => { // The actual function that executes the arithmetic
			
			writeLog(logdate,'tool basic_calculator...',requestid,LogLevel.warning);


			let r;
			if(operation === '/' && operand2 === 0) { // Handle division by zero just in case
			  return 'Error: Cannot divide by zero.';
			}

			switch (operation) {
			  case '+': r = operand1 + operand2; break;
			  case '-': r = operand1 - operand2; break;
			  case '*': r = operand1 * operand2; break;
			  case '/': r = operand1 / operand2; break;
			  case '^':
				// For exponentiation
				r = Math.pow(operand1, operand2); break;
			  default:
				return 'Error: Unsupported operation.';
			}
			writeLog(logdate,'tool basic_calculator='+r.toString(),requestid,LogLevel.warning);

			return r.toString(); // Returns as a string for consistency
		}
	);


	// 10 // call_phone_number //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	openai.addTool(
		{
			name: 'call_phone_number',
			description: 'Opens the user\'s phone application and dials a mobile number or a landline number.\n' +
				'The callee can be either a C_dS_visitor or a C_dS_collaborator instance. The user specifies whether they want to call a collaborator or a visitor.' +
				'Pass the values ->mobile and ->phone exactly as they appear in the callee specified by the user.' +
				'Either the mobile number, the phone number, or both might be empty, and that is okay. Never generate or substitute a value from any other source.\n' +
				'By default, the tool will prioritize the mobile number. If no mobile number is available, it will use the landline number if present.' +
				'If neither a mobile nor a landline number is available in the callee file, the tool will return a warning prompt.'
			,
			parameters: {
				type: 'object',
				properties: {
					mobilenumber: {
						type: 'string',
						description: 'C_dS_visitor->mobile or C_dS_collaborator->mobile. Optional, pass it unchanged when not found empty.'
					},
					landlinenumber: {
						type: 'string',
						description: 'C_dS_visitor->phone or C_dS_collaborator->phone. Optional, pass it unchanged when not found empty.'
					}
				},
				required: []
			}
		},
		async({ mobilenumber = '', landlinenumber = '' }) => {
			try
            {	
				const mobile = (mobilenumber || '').trim().replace(/\s+/g, '');
				const landline = (landlinenumber || '').trim().replace(/\s+/g, '');

				const cleanedNumber = mobile ? mobile : landline; // gives a priority to the mobile
				if(!cleanedNumber) return 'Please warn the user that no phone number was found in the visitor file.';
				
				writeLog(logdate,'tool call_phone_number : sending call command to smartphone',requestid,LogLevel.warning);

				clientws.send(JSON.stringify({ status:'phonecall', phonenumber:cleanedNumber }));

				writeLog(logdate,'tool call_phone_number : call command sent',requestid,LogLevel.warning);

				//return 'statut=success';
				return 'Short answer to user: Calling!';

			} catch (error) {
				writeLog(logdate,error.message,requestid,LogLevel.error);
				writeLog(logdate,error.stack,requestid,LogLevel.error);
				return internalerror;
			}
		}
	);
	
	
	// 11 // open_navigation //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	openai.addTool(
		{
			name: 'open_navigation',
			description: 'Opens the user\'s navigation application and presets the destination as the C_dS_visitor\'s address.\n'+
				'Pass the values C_dS_visitor->[address,zipcode,city,country] exactly as they appear in the C_dS_visitor instance.' +
				'Some might be empty, that is ok. Never generate or substitute a value from any other source.\n'
			,
			parameters: {
				type: 'object',
				properties: {
					address: {
						type: 'string',
						description: 'C_dS_visitor->address. Optional, pass it unchanged when not found empty.'
					},
					zipcode: {
						type: 'string',
						description: 'C_dS_visitor->zipCode. Optional, pass it unchanged when not found empty.'
					},
					city: {
						type: 'string',
						description: 'C_dS_visitor->city. Optional, pass it unchanged when not found empty.'
					},
					country: {
						type: 'string',
						description: 'C_dS_visitor->country. Optional, pass it unchanged when not found empty.'
					}
				},
				required: []
			}
		},
		async({ address = '', zipcode = '', city = '', country = '' }) => { // in some cases, only the address is filled in the C_dS_visitor instance
			try
            {
				if(!address.trim()) return 'Answer to user: "There is no address in the visitor file."';
				
				let locationParts = [address, zipcode, city, country].filter(part => part.trim() !== ''); // removes empty values from the array.
				locationParts = [address, zipcode, city, country].map(part => part.trim()); // removes heading and trailing spaces from each value.
				const destination = locationParts.join(', ');
				
					writeLog(logdate,'open_navigation trigger for visitor at ['+destination+']',requestid,LogLevel.warning);

				clientws.send(JSON.stringify({ status:'navigate', address: destination }));

					writeLog(logdate,'open_navigation Navigation command sent successfully.',requestid,LogLevel.warning);

				//return 'statut=success';
				return 'Short answer to user: "let\'s go!"';

			} catch (error) {
				writeLog(logdate,error.message,requestid,LogLevel.error);
				writeLog(logdate,error.stack,requestid,LogLevel.error);
				return internalerror;
			}
		}
	);
	

	// 12 // visitor_tracking //////////////////////////////////////////////////////////////////////////////////////////////////////////////   
    openai.addTool(
        {
			name: 'visitor_tracking',
			description:
			  'Returns a list of C_dS_reservation instances involving the specified visitor.\n' +
					'Use the �partof� parameter to determine which appointments to retrieve:\n' +
					'� partof = 0 (or omit it): Return all past and future appointments.\n' +
					'� partof = 1: Return only past appointments (the visitor�s appointment history).\n' +
					'� partof = 2: Return only future appointments (the visitor�s planned appointments).\n' +
					'� partof = -1: Return the most recent attended appointment (when the visitor was last here).\n' +
					'� partof = -2: Return the earliest future appointment (when the visitor is next scheduled).\n'
			  ,
			parameters: {
				type: 'object',
				properties: {
					visitorid: {
						type: 'integer',
						description:
						'Mandatory, the visitor�s id, that you find here C_dS_visitor->id. Always use the user\'s lately specified visitor.\n'
					},
					partof: {
						type: 'integer',
						enum: [-2, -1, 0, 1, 2],
						description:
						  'Allows to query only a part of the visitor\'s meetings.\n' +
						  '� partof = 0 returns the full list of written C_dS_reservation instances for the visitor.\n' +
						  '� partof = 1 queries only C_dS_reservation instances that were attended in the PAST.\n' +
						  '� partof = 2 queries only C_dS_reservation instances that are planned in the FUTURE.\n' +
						  '� partof = -1 to query the most recent attended C_dS_reservation instance, that is when the visitor came last time.\n' +
						  '� partof = -2 to query the first PLANNED C_dS_reservation instance, that is when the visitor is scheduled to come next time.'
					}
				},
				required: ['visitorid','partof']
            }
        },
        async({ visitorid , partof = 0 }) => {
            try
            {
                let url = 'https://ai.mobminder.com/query/visiapps.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', lgn);
                params.append('pwd', pwd);
                params.append('kid', kid);
                
				params.append('id', visitorid);
				
                if(partof!=0) params.append('partof', partof);
                // if(phoneormobile) params.append('phoneormobile', phoneormobile);
                
        
                let response = await callfetch(logdate,url,params,requestid,false);
                return response;
            } catch (error) {
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );

	
	// 99 // analyze_image //////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Photography
	//
	// openai.sendUserMessageContent(
	// 		[{ type: 'input_text', text: 'Now ask the user what questions he has about the uploaded image, then use the tool \'analyze_image\'.' }]
	// );
	// openai.sendUserMessageContent(
	// 		[{ type: 'input_text', text: 'Notify the user that the analysis is in progress.' }]
	// );
	//
	
	openai.addTool(
        {
            name: 'analyze_image',
            description: 'This tool analyses a photography or an image or reads text out of it. Use this tool each time the user asks for information about an uploaded image or photography.\n'+
				'REMINDER: Just before calling this tool, tell the user that the analysis might take a few seconds.'
			,
            parameters: {
                type: 'object',
                properties: {
                    question: {
                        type: 'string',
                        description: 'The user\'s question about the photograph or image guides this tool in extracting relevant information from the analysis.'
                    },
                    mode: {
                        type: 'integer',
						enum: [0, 1], 
                        description: 'Activates the OCR mode (text reading ability). Defaults to zero. Set mode = 1 when the user asked for READING information or text.'
                    }
                },
                required: ['question']
            }
        },
        async({ question, mode = 0 }) => {
            try
            {
				clientws.send(JSON.stringify({ status:'InitiatingImageAnalysis' }));
				if(mode==1) question = 'Could you extract all the text from the document and structure your result as a key/value jason?';
				
                let filename = getcurrentpicture();
                writeLog(logdate,'tool analyze_picture : sending request to openai vision model for current picture ('+filename+') with question : '+question,requestid,LogLevel.warning);
				
                const { OPENAI_API_KEY } = process.env;
				const { IMG_URL,IMG_PORT } = process.env;
                const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
				
				
				let response;
				if (true)
				{
					// the web link version:
					response = await openai.chat.completions.create({
						model:'gpt-4o-mini',
						 messages:[
							{
								role: 'user',
								content: [
									{
										type: 'text',
										text: question,
									},
									{
										type: 'image_url',
										image_url:{url:IMG_URL+':'+IMG_PORT+'/GTW01_vision_fetch/'+filename}
										// image_url: {url:'https://www.mobminder.com/assets/imgs/beauty/control.jpg'},
										// image_url: {url:'http://www.mobminder.com/assets/imgs/beauty/IMG_8825.JPG'},
									}
								 ]
							 }
						 ]
					 });
				
				}
				else{
					// the b64 version:
					const { FILE_DIRECTORY } = process.env;
					const filePath = FILE_DIRECTORY+'/pictures/'+filename;
					let base64Image = fileToBase64(filePath);
					writeLog(logdate,'tool analyze_picture : with base64 image',requestid,LogLevel.warning);


					response = await openai.chat.completions.create({
						model:'gpt-4o-mini',
						messages:[
							{
								role: 'user',
								content: [
									{
										type: 'text',
										text: question,
									},
									{
										type: 'image_url',
										image_url: {
											url: 'data:image/jpeg;base64,'+base64Image
										},
									}
								]
							}
						]
					});
				}
				
                let result = response.choices[0];
                clientws.send(JSON.stringify({ status:'ImageAnalysisCompleted' }));
				
				let r = result.message.content;
				if(mode==1) r = r + '\n<instructions>Do not read the extracted text.\n'+
					'Re-read now the user\'s question and see if the answer stands in the provided jason.\n'+
					'If not, ask the user what he wants to extract from the text or if the entire tool result should be read.</instructions>';
				
				writeLog(logdate,'tool analyze_picture : response : '+r,requestid,LogLevel.warning);
                return r;
            } catch (error) {
				
				clientws.send(JSON.stringify({ status:'ImageAnalysisCompleted' }));
                writeLog(logdate,error.message,requestid,LogLevel.error);
                writeLog(logdate,error.stack,requestid,LogLevel.error);
                return internalerror;
            }
        }
    );	
	
}
