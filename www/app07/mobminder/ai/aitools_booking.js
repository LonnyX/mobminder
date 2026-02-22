import { writeLog,LogLevel,callfetch } from './utils.js';

const internalerror = 'A programmatic error occurred in the tool';

//TODO PASCAL : used anymore?
const pickdate = (datetime) => { // 0, undefined or anything starting with YYYY-MM-DD, e.g. [YYYY-MM-DD weekday HH:MM]
	const defaultdate = () =>
	{ // Edge case
		const today = new Date(); // Get current system date
		const date = today.toISOString().split('T')[0]; // Extract YYYY-MM-DD
		return date;
	}
	
	if(datetime==0 || datetime==undefined) return defaultdate();
	
	// Step 1: Extract the first 10 characters (YYYY-MM-DD)
	const extractedDate = datetime.substring(0, 10); // '2024-02-07'

	// Step 2: Validate the format YYYY-MM-DD
	const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(extractedDate);

	// Step 3: Ensure numeric values are actually numbers
	const [year, month, day] = extractedDate.split('-').map(Number);
	const isNumeric = !isNaN(year) && !isNaN(month) && !isNaN(day);

	if(isValidDate && isNumeric) return extractedDate;
	else return defaultdate();
};

//USE CASES DECLARATION /////////////////////////////////////////////////////////////////////////////////////
export const uc0init	= { name : 'uc0init',	description : 'Inbound call rising: You are working at the welcome desk. Objective: Identify the caller intention and choose the appropriate Use Case.' };
export const uc1make	= { name : 'uc1make', 	description : 'the caller wants to schedule a new appointment.' };
export const uc2cancel	= { name : 'uc2cancel', description : 'the caller wants to cancel an existing appointment.' };
export const uc3replan	= { name : 'uc3replan', description : 'the caller wants to replan an existing appointment.' };
export const uc4remind	= { name : 'uc4remind', description : 'the caller wants to be reminded an existing appointment.' };
export const uc5message = { name : 'uc5message',description : 'the caller wants to leave a message.' };
export const uc6inform	= { name : 'uc6inform',	description : 'the caller wants to inquiry about general information about our business.' };

//simple test of sharing context between cs (with conversational steps!)
export const uc0test		= { name : 'uc0test',				description : 'this use case is used for testing' };
//simple test of sharing context between cs (with simple instructions list)
export const uc1test		= { name : 'uc1test',				description : 'this use case is used for testing' };

// OVERALL INSTRUCTIONS (for conversation steps) /////////////////////////////////////////////////////////////////////////////////////
const overall_instruction = '# Overall Instructions'
							+'\n- Ignore previous workflow states logic and context'
							+'\n- You MUST follow the conversation steps closely step-by-step as the only flow of the interaction. Respect the transitions and conditions. Never deviate from them.'
							+'\n- Start immediately the flow at state "1_first_step" as soon as a message is received.'
							+'\n- Always speak in French, even if the caller greets you in English (e.g., "hi").'
							+'\n- If the conversation states workflow needs calling the "EngageNextCS" tool, DO NOT answer yourself. Instead, immediately call the tool. Do not just announce the transfer; actually perform it.'
							;
							
// CS OR CS (conversational state) DECLARATION ///////////////////////////////////////////////////////////////////////////////////////
const cs01welcome = { 
	
	//name of conversational state
	name : 'cs01welcome', 
	
	//general instructions
	instruction : overall_instruction,
	
	//allowed use case transitions
	allowedUseCases : [uc1make,uc2cancel,uc3replan,uc4remind,uc5message,uc6inform], // only here and in cs04recap
	
	//structured conversation
	//optional field
	//will be json stringified and added to general instruction
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'Greet the caller, then identify what use case would please the caller.',
			instructions: [
				'Unless they spontaneously state it, ask the caller how you can help them.',
				'Only in case the caller asks for it, make a list of possible options from EngageNextCS description, and list them.', //it works but too long for testing
				'Once the appropriate use case id (UseCaseId) is identified, your mission is a success, transfer the caller by using the "EngageNextCS" tool.'
			],
			examples: [
				'"Good morning, this is the welcome desk of the {C_dS_account.name}"'
			],
			transitions: [
				{
					next_step: 'call "EngageNextCS" tool with selected useCaseId.',
					condition: 'once the caller has describe what I want to do.'
				}
			]
		}
	],
};
const cs02availability = { 
	name : 'cs02availability',
	instruction : overall_instruction,
	conversationSteps : 
	[
		{
			id: '1_first_step',
			description: 'let the caller select a type of service (service = workcode) (type of service = criteria #1).',
			instructions: [
				'never greet the user',
				'ask to caller which type of service he wants to book.',
				'list of type of service:',
				//TODO PASCAL : AI should find the list of services from context
				'- simple consultation (C_dS_workcode_id=111),',
				'- massage (C_dS_workcode_id=112),',
				'- check-up (C_dS_workcode_id=113).',
				'do not read the C_dS_workcode_id, this is an internal information',
			],
			examples: [
				'assistant: could you please select a type of service? here is the list : consultation, check-up,...',
				'user: I choose the check-up',
			],
			transitions: [
				{
					next_step: '2_asktoselectadate',
					condition: 'once the caller has selected a type of service, go to the 2_asktoselectadate step'
				}
			]
		},
		{
			id: '2_asktoselectadate',
			description: 'ask to caller from which date he is looking for availabilities (date = criteria #2).',
			instructions: [
				'ask to caller from which date he is looking for availabilities.',
				//'Repeat it back to confirm correctness.', //if necessary
			],
			examples: [
				'from which date do you want to find a availability?',
				'You said 12 March 1985, correct?'
			],
			transitions: [
				{
					next_step: '3_look_for_availabilities',
					condition: 'once the caller has selected the from date.'
				}
			]
		},
		{
			id: '3_look_for_availabilities',
			description: 'look for availabilities in database.',
			instructions: [
				'ONLY after have received type of service (criteria #1) AND from date (criteria #2), then CALL the "Availabilities" TOOL',
			],
			examples: [
			],
			transitions: [
				{
					next_step: '4_availabilitiesnotfound',
					condition: 'if the Availabilities tool did not find any availabilities' 
				},
				{
					next_step: '5_select_availability',
					condition: 'if the Availabilities tool has found one or several availabilities'
				}
			]
		},
		{
			id: '4_availabilitiesnotfound',
			description: 'no availability found in database',
			instructions: [
				'explain to caller that no availability were found in database',
				'go back to 1_first_step'
			],
			examples: [
				'Sorry, no availability have been found for these criteria'
			],
			transitions: [
				{
					next_step: '1_first_step',
				}
			]
		},
		{
			id: '5_select_availability',
			description: 'select one availability',
			instructions: [
				'ask the caller to choose one',
				'Present returned items one by one with a 2 seconds pause for reflection. Report only cueIn (weekday, date, start time, end time).',
				'Continue listing until the caller selects one C_dS_availability or abandons the process. Then remember the selected C_dS_availability->id for further usage.',
				'Repeat it back to confirm correctness.',
			],
			examples: [
				'here is the list of availabilities...',
				'please choose one',
				'You said 12 March 1985, correct?'
			],
			transitions: [
				{
					next_step: 'call the "EngageNextCS" tool to go to authentication conversation state',
					condition: 'once the caller has selected one availability'
				}
			]
		}
	]
};
const cs03authentication = { 
	name : 'cs03authentication',
	instruction : overall_instruction,
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'Ask for the caller\'s firstname.',
			instructions: [
				//'Let them know upfront that for any account-specific assistance, you\'ll need some verification details.',
				'Politely ask, \'What is your firstname?\'',
				'As it is a firstname, please match it with an existing firstname, found in your general knowledge.',
			],
			examples: [
			],
			transitions: [
				{
					next_step: '2_second_step',
					condition: 'Once firstname and lastname are obtained.'
				}
			]
		},
		{
			id: '2_second_step',
			description: 'Ask for the caller\'s lastname.',
			instructions: [
				'Politely ask, \'What is your lastname?\'',
				'If the caller\'s speech does not sound precise, ask for a spelling, then re-string the spelled letters.',
			],
			examples: [
			],
			transitions: [
				{
					next_step: '3_request_DOB',
					condition: 'Once firstname and lastname are obtained.'
				}
			]
		},
		{
			id: '3_request_DOB',
			description: 'Request and confirm date of birth.',
			instructions: [
				'Ask for the caller\'s date of birth.',
				'Repeat it back to confirm correctness.', //it works but too long for testing
				'Iterate until the caller confirms.', //it works but too long for testing
			],
			examples: [
				'Thank you. Could I please have your date of birth?',
				'You said 12 March 1985, correct?'
			],
			transitions: [
				{
					next_step: '4_search_for_user',
					condition: 'Once DOB is confirmed'
				}
			]
		},
		{
			id: '4_search_for_user',
			description: 'Authenticate caller',
			instructions: [
				'call the "QueryVisitors" tool function with the provided caller\'s data (mandatory parameters are: firstname, lastname AND date of birth).',
    			'once the "QueryVisitors" tool has returned a C_dS_visitor_id, tell the caller he has been authenticated AND then call the "EngageNextCS" tool.',
				'otherwise, if the "QueryVisitors" tool did not return any C_dS_visitor, go back to 1_first_step.'
			],
			examples: [
			],
			transitions: [
				{
					next_step: 'EngageNextCS',
					condition: 'once the caller (C_dS_visitor_id) has been found by QueryVisitors tool.'
				},
				{
					next_step: '1_first_step',
					condition: 'if the QueryVisitors tool did not find any C_dS_visitor.'
				},
			]
		},
	]
};
const cs04recap = { 
	name : 'cs04recap',
	instruction : overall_instruction,
	allowedUseCases : [uc1make,uc2cancel,uc3replan,uc4remind,uc5message,uc6inform], // only here and in cs01welcome
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'provide a summary of the last request which has been done',
			instructions: [
				'never greet the user',
				'provide a summary of the last user\s request',
				'your answer should be short and consise',
				'the request has already done, do not tell to caller that you will to it now',
				'then ask the caller if he wants to follow another usercase'
			],
			examples: [
			],
			transitions: [
				{
					next_step: 'call the EngageNextCS tool',
					condition: 'Once the caller wants to select another use case.'
				},
				{
					next_step: 'call the hang_up tool',
					condition: 'Once the caller wants to quit the conversation.'
				},
			]
		}
	]
};
const cs05cancel = { 
	name : 'cs05cancel',
	instruction : overall_instruction,
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'ask to caller if he really want to delete the appointment',
			instructions: [
				'never greet the user',
				'ask to caller if he really want to delete the appointment',
			],
			examples: [
				'do you really want to delete the appointment?'
			],
			transitions: [
				{
					next_step: '2_delete_appointment',
					condition: 'once the caller has confirmed the delete'
				},
				{
					next_step: '3_gotonextstep',
					condition: 'once the caller has cancelled the delete'
				},
			]
		},
		{
			id: '2_delete_appointment',
			description: 'delete the new appointment',
			instructions: [
				'call the "delete_reservation" tool'
			],
			examples: [
			],
			transitions: [
				{
					next_step: '3_gotonextstep',
					condition: 'once "delete_reservation" has been successfuly called'
				},
			]
		},
		{
			id: '3_gotonextstep',
			description: 'go to the next conversation state',
			instructions: [
				'call the "EngageNextCS" tool'
			],
			examples: [
			],
			transitions: [
			]
		}
	]
};
const cs06schedule = { 
	name : 'cs06schedule',
	instruction : overall_instruction,
	conversationSteps : [
		{
			//TODO PASCAL : idea : ask caller to write a note in appointment?
			id: '1_first_step',
			description: 'ask to caller if he wants to add a note inside the appointment',
			instructions: [
				'never greet the user',
				'ask to caller if he wants to add a note inside the appointment',
			],
			examples: [
				'do you want to add a note in the new appointment?'
			],
			transitions: [
				{
					next_step: '2_create_appointment',
					condition: 'once the caller has given his answer'
				},
			]
		},
		{
			id: '2_create_appointment',
			description: 'create the new appointment',
			instructions: [
				'call the "post_reservation" tool'
			],
			examples: [
			],
			transitions: [
				{
					next_step: '3_gotonextstep',
					condition: 'once "post_reservation" has been successfuly called'
				},
			]
		},
		{
			id: '3_gotonextstep',
			description: 'go to the next conversation state',
			instructions: [
				'call the "EngageNextCS" tool'
			],
			examples: [
			],
			transitions: [
			]
		}
	]
};
const cs07list = { 
	name : 'cs07list',
	instruction : overall_instruction,
	//allowedUseCases : [uc2cancel,uc3replan], //not used!
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'You are a planning specialist at {C_dS_account.name}. Your mission is to list their existing appointments to the caller.',
			instructions: [
				'never greet the user.',
				'call the QueryReservation tool.',
				'repeat the list of appointements as received from QueryReservation tool.',
				'if the caller wants to know more, apply the right #partof# option parameter on a new QueryReservation call.'
			],
			examples: [
			],
			transitions: [
				{
					next_step: '2_second_step',
					condition: 'You have finished listing the caller appointments.'
				},
			]
		},
		{
			id: '2_second_step',
			description: 'Your mission is now to identify the caller\'s next intention.',
			instructions: [
				'if current use case is "uc2cancel", then ask the caller which appointment to delete, remind C_dS_reservation_id.',
				'else if current use case is "uc3replan", then ask the caller wich appointment to replan, remind C_dS_reservation_id.',
				'else if current use case is "uc4remind", then ask the caller if he wants to delete or to replan an appointment or to do nothing, remind C_dS_reservation_id.', //not working
			],
			examples: [
			],
			transitions: [
				{
					next_step: 'go to the next conversation state by calling "EngageNextCS" tool.',
					condition: 'once the caller has confirmed one of: delete an appointment, replan an appointment or terminate this demand.'
				},
			]
		}
	]
};
const cs08message = { 
	name : 'cs08message',
	instruction : overall_instruction,
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'asks to caller which message he wants to send to current doctor',
			instructions: [
				'never greet the user',
				'ask to caller which message he wants to send to current doctor',
			],
			examples: [
				'could you please describe me the message you want to send to the doctor ?'
			],
			transitions: [
				{
					next_step: '2_send_message',
					condition: 'once the caller has given the message to send'
				},
			]
		},
		{
			id: '2_send_message',
			description: 'send the message',
			instructions: [
				'call the "post_message" tool'
			],
			examples: [
			],
			transitions: [
				{
					next_step: '3_gotonextstep',
					condition: 'once "post_message" has been successfuly called'
				},
			]
		},
		{
			id: '3_gotonextstep',
			description: 'go to the next conversation state',
			instructions: [
				'call the "EngageNextCS" tool'
			],
			examples: [
			],
			transitions: [
			]
		}
	]
};
const cs09information = { 
	name : 'cs09information',
	instruction : overall_instruction,
	conversationSteps : [
		/*{
			id: '1_first_step',
			description: 'asks to caller what he wants to know about his favorite doctor or the medical center.',
			instructions: [
				'never greet the user,',
				//TODO PASCAL : validate the solution for loading general information about client
				'available information should be found in <datamodel> and <data> from current context.',
				'ask to caller what he wants to know.',
			],
			examples: [
				'what do you want to know about your favorite doctor and his medical center?'
			],
			transitions: [
				{
					next_step: 'go to the next conversation state by calling "EngageNextCS" tool.',
					condition: 'if the caller has nothing else to ask.'
				},
				{
					next_step: '1_first_step.',
					condition: 'if the caller wants to asks another information.'
				},
			]
		}*/
		{
			id: '1_first_step',
			description: 'provide general information about the center.',
			instructions: [
				'never greet the user,',
				//TODO PASCAL : validate the solution for loading general information about client
				'available information should be found in <datamodel> and <data> from current context.',
				'If the caller already told you their request, provide the answer. If he didn\'t state a question yet, prompt him.',
			],
			examples: [
				'what do you want to know about your favorite doctor and his medical center?'
				, '(adress was asked in a previous prompt) The address of the center is {see <data>}'
				, '(opening hours were asked in a previous prompt) The opening hours on wednesday are {see <data>}'
			],
			transitions: [
				{
					next_step: 'go to the next conversation state by calling "EngageNextCS" tool.',
					condition: 'if the caller has nothing else to ask.'
				},
				{
					next_step: '1_first_step.',
					condition: 'if the caller wants to asks another information.'
				},
			]
		}
	]
};
//simple test of sharing context between cs (with conversational steps!) ////////////////////////////////
const cs01test = { 
	name : 'cs01test',
	instruction : overall_instruction,
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'ask to them to give a letter from the abc',
			instructions: [
				'do no greet them',
				'ask to them to give a letter from the abc'
			],
			examples: [
			],
			transitions: [
				{
					next_step: 'go to the next conversation state by calling "EngageNextCS" tool.',
					condition: 'once the caller has answered the question.'
				},
			]
		}
	]
};
const cs02test = { 
	name : 'cs02test',
	instruction : overall_instruction,
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'ask to them to give a number',
			instructions: [
				'do no greet them',
				'ask to them to give a number',
			],
			examples: [
			],
			transitions: [
				{
					next_step: 'go to the next conversation state by calling "EngageNextCS" tool.',
					condition: 'once the caller has answered the question.'
				},
			]
		}
	]
};
const cs03test = { 
	name : 'cs03test',
	instruction : overall_instruction,
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'ask to them to give a firstname',
			instructions: [
				'do no greet them',
				'ask to them to give a firstname',
			],
			examples: [
				'give me please a firstname'
			],
			transitions: [
				{
					next_step: 'go to the next conversation state by calling "EngageNextCS" tool.',
					condition: 'once the caller has answered the question.'
				},
			]
		}
	]
};
const cs04test = { 
	name : 'cs04test',
	instruction : overall_instruction,
	conversationSteps : [
		{
			id: '1_first_step',
			description: 'give the 3 answers to them',
			instructions: [
				'do no greet them',
				'give the 3 answers to them',
			],
			examples: [
				'you have given the following answers : letter is "E", number is "10" and firstname is "Robert"'
			],
			transitions: [
				{
					next_step: 'end of process',
					condition: 'no condition'
				},
			]
		}
	]
};
//simple test of sharing context between cs (with simple instructions list) /////////////////////////////
const cs11test = { 
	name : 'cs11test',
	instruction : 	
`# General instruction:
- speak french.
# Steps:
1. ask to them to give a letter between A and Z.
2. once the caller has answered the question, go to the next conversation state by calling "EngageNextCS" tool.'
Example:
Assistant: "Please give me a letter between A and Z"
User: "B"
Assistant: (calls EngageNextCS tool)`
};
const cs12test = { 
	name : 'cs12test',
	instruction :
`# General instruction:
- speak french.
# Steps:
1. send a message asking the caller to give a number between 1 and 10. Do not wait for the caller to speak first.
2. Once the caller has answered the question, go to the next conversation state by calling "EngageNextCS" tool.'
Example:
Assistant: "Please give me a number between 1 and 10."
User: "7"
Assistant: (calls EngageNextCS tool)`
};
const cs13test = { 
	name : 'cs13test',
	instruction : 
`# General instruction:
- speak french.
# Steps:
1. start by repeating the two questions and the two answers provided by the user. Do not wait for the caller to speak first.
Example:
Assistant: "You answered the following:
1. What is your letter? → A
2. What is your number? → 1`
};


//DEFINE USE CASE WORFLOWS ///////////////////////////////////////////////////////////////////////////////////////////
const matrix = [
	{	//uc0init
		usecase : uc0init,
		cs : [cs01welcome]
	},
	{	//uc1make
		usecase : uc1make,
		cs : [cs02availability,cs03authentication,cs06schedule,cs04recap]
	},
	{	//uc2cancel
		usecase : uc2cancel,
		cs : [cs03authentication,cs07list,cs05cancel,cs04recap] //cs03authentication //TODO RESET
	},
	{	//uc3replan
		usecase : uc3replan,
		cs : [cs03authentication,cs07list,cs02availability,cs06schedule, cs05cancel,cs04recap] //cs03authentication //TODO RESET
	},
	{	//uc4remind
		usecase : uc4remind,
		cs : [cs03authentication,cs07list,cs04recap] //cs03authentication //TODO RESET
	},
	{	//uc5message
		usecase : uc5message,
		cs : [cs03authentication,cs08message,cs04recap]
	},
	{	//uc6inform
		usecase : uc6inform,
		cs : [cs09information,cs04recap]
	},
	{   //uc0test
		usecase : uc0test,
		cs : [cs01test,cs02test,cs03test,cs04test]
	},
	{   //uc1test
		usecase : uc1test,
		cs : [cs11test,cs12test,cs13test]
	},
]

//WORFLOW FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////
//find first cs of a given use case
export function getFirstCsForUseCaseName(usecasename,logdate,requestid)
{
	writeLog(logdate,'calling getFirstCsForUseCaseName',requestid,LogLevel.verbose);
	for (let i = 0; i < matrix.length; i++) {
		let row = matrix[i];
		if(row.usecase.name == usecasename)
		{
			let cs = row.cs[0];
			writeLog(logdate,'calling getFirstCsForUseCaseName('+usecasename+') = '+cs.name,requestid,LogLevel.verbose);
			return cs.name;
		}
	}
	writeLog(logdate,'calling getFirstCsForUseCaseName('+usecasename+') = first cs not found',requestid,LogLevel.verbose);
	return null;
}
//find current or next or last cs of current use case
export function getCsByUseCaseNameAndCsName(usecasename,csname,mode,logdate,requestid){
	writeLog(logdate,'calling getCsByUseCaseNameAndCsName',requestid,LogLevel.verbose);
	for (let i = 0; i < matrix.length; i++) {
		let row = matrix[i];
		if(row.usecase.name == usecasename)
		{
			for (let j = 0; j < row.cs.length; j++) {
				let cs = row.cs[j];
				if(cs.name == csname)
				{
					switch (mode){
						case 'current': return cs;
						case 'next': return row.cs[j+1];
						default : return row.cs[row.cs.length-1]; //last
					}
				}
			}
		}
	}
	writeLog(logdate,'calling getInstructionByCsName('+usecasename+','+csname+') = step not found',requestid,LogLevel.verbose);
	return null;
}

//ENGAGE NEXT CS TOOLS //////////////////////////////////////////////////////////////////////////////////////
function addEngageNextUseCaseTool			(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addWelcomeEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		//load allowed use cases of current cs and prepare list of descriptions and enumeration of names
		let currentcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'current',conversationContext.logdate,conversationContext.requestid);
		const availableUseCaseList = currentcs.allowedUseCases.map((usecase) => '- \''+usecase.name+'\' : '+usecase.description).join('\n');
		const useCaseEnum = currentcs.allowedUseCases.map((usecase) => usecase.name);

		let description = 'Triggers a transfer of the caller to a another use case.\n'+
			'Use this tool only if the caller request is better handled by another use case.\n'+
			'You must select one of the following available use cases in "UseCaseId":\n'+availableUseCaseList+'.\n'+ // depends on the CS
			'"UseCaseId" is mandatory, never leave "UseCaseId" empty or undefined.\n'+
			'Once the tool is called, you must stay silent and never respond again, do not just announce the transfer; actually perform it.\n'+
			'Let the new use case take over the conversation directly.\n'+
			'if the caller has not clearly stated their request, you must ask the question again.';

			
		writeLog(conversationContext.logdate,'with description='+description,conversationContext.requestid,LogLevel.verbose);
		writeLog(conversationContext.logdate,'with useCaseEnum enum=['+useCaseEnum+']',conversationContext.requestid,LogLevel.verbose);

		openai.addTool(
		{
			name: 'EngageNextCS',
			description: description,
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.',
						},
						UseCaseId: {
							type: 'string',
							description:'The specialized destination usecaseid to handle the caller\'s request. Must be chosen from the list below and might not be empty.',
							enum: useCaseEnum,
						}
				},
				required: [
					'rationale_for_transfer',
					'UseCaseId',
				],
			},
				
		},
		async({ rationale_for_transfer ='', UseCaseId='' }) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (welcome)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param UseCaseId='+UseCaseId,conversationContext.requestid,LogLevel.warning);

				//check if parameters are valid
				if(UseCaseId==''){
					writeLog(conversationContext.logdate,'gotonext | with error : caller case is empty',conversationContext.requestid,LogLevel.warning);
					return 'error : the caller case is empty! please ask the caller to rephrase his request';
				}
				else if(!useCaseEnum.includes(UseCaseId)){
					writeLog(conversationContext.logdate,'gotonext | with error : caller case does not exist in enumeration',conversationContext.requestid,LogLevel.warning);
					return 'error : caller case does not exist in enumeration! please ask the caller to rephrase his request';
				}
				//TODO PASCAL : confirm this disabled section of code
				//else if(conversationContext.currentusecase == UseCaseId){
				//	writeLog(conversationContext.logdate,'gotonext | with error : use case did not change',conversationContext.requestid,LogLevel.warning);
				//	return 'error : use case did not change! please ask the caller to rephrase his request';
				//}
				else{					
					writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);
					conversationContext.history.push('go to use case ['+UseCaseId+'] for reason ['+rationale_for_transfer+']');
					callbackselectcs(UseCaseId,null);
					return '';
				}

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addInformationEngageNextCSTool		(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addInformationEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'EngageNextCS',
			//description: 'call this tool if the caller wants to go get a summary  to next conversation state',
			description: 'call this tool if the caller does not need any more information',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
						requested_information: {
							type: 'string',
							description: 'the list of all informations requested by the caller and the given answers',
						},
				},
				required: [
					'rationale_for_transfer',
					'requested_information',
				],
			},
				
		},
		async({ rationale_for_transfer ='', requested_information = ''}) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (information)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param requested_information='+requested_information,conversationContext.requestid,LogLevel.warning);

				let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
				writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,LogLevel.warning);

				conversationContext.history.push('go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+'] with requested information ['+requested_information+']{');

				callbackselectcs(null,nextcs.name);

				writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);
				
				return '';

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
		
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addAuthenticationEngageNextCSTool	(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addAuthenticationEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'EngageNextCS',
			description: 'call this tool if the caller\'s file id has been found, that is C_dS_visitor_id.',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
						C_dS_visitor_id: {
							type: 'integer',
							description: 'the ID (numeric identifier) of the selected caller (equals to authenticated user)',
						},
				},
				required: [
					'rationale_for_transfer',
					'C_dS_visitor_id',
				],
			},
				
		},
		async({ rationale_for_transfer ='', C_dS_visitor_id = -1}) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (authentication)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param C_dS_visitor_id='+C_dS_visitor_id,conversationContext.requestid,LogLevel.warning);

				if(C_dS_visitor_id == undefined || C_dS_visitor_id == 0 || C_dS_visitor_id==-1){
					writeLog(conversationContext.logdate,'gotonext | with error : C_dS_visitor_id is invalid = '+C_dS_visitor_id,conversationContext.requestid,LogLevel.warning);
					return 'error : C_dS_visitor_id is invalid';
				}
				else{
					conversationContext.C_dS_visitor_id = C_dS_visitor_id;

					let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
					writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,conversationContext.requestid,LogLevel.warning);

					conversationContext.history.push('go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+'] with C_dS_visitor_id ['+C_dS_visitor_id+']');

					callbackselectcs(null,nextcs.name);

					writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);
					return '';
				}

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
		
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addMessageEngageNextCSTool			(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addMessageEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'EngageNextCS',
			description: 'call this tool when the required properties are identified, at that moment your mission is fulfilled.',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
						message_to_send: {
							type: 'string',
							description: 'the complete message that the caller wants to send',
						},
				},
				required: [
					'rationale_for_transfer',
					'message_to_send',
				],
			},
				
		},
		async({ rationale_for_transfer ='', message_to_send = ''}) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (message)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param message_to_send='+message_to_send,conversationContext.requestid,LogLevel.warning);

				let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
				writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,LogLevel.warning);

				conversationContext.history.push('go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+'] with the message to send ['+message_to_send+']');
				
				callbackselectcs(null,nextcs.name);

				writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);

				return '';

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
		
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addAvailabilitiesEngageNextCSTool	(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addAvailabilitiesEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'EngageNextCS',
			description: 'go to authentication conversation state, but call ONLY after the caller has select an availability free slot (C_dS_availability_id) in the list of availability free slots',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
						C_dS_availability_id: {
							type: 'integer',
							description: 'the C_dS_availability_id of the available appointment selected by the user',
						},
				},
				required: [
					'rationale_for_transfer',
					'C_dS_availability_id',
				],
			},
				
		},
		async({ rationale_for_transfer ='', C_dS_availability_id = -1}) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (availability)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param C_dS_availability_id='+C_dS_availability_id,conversationContext.requestid,LogLevel.warning);

				if(C_dS_availability_id == undefined || C_dS_availability_id == 0 || C_dS_availability_id==-1){
					writeLog(conversationContext.logdate,'gotonext | with error : C_dS_availability_id is invalid'+C_dS_availability_id,conversationContext.requestid,LogLevel.warning);
					return 'error : C_dS_availability_id is invalid';
				}
				else{
					let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
					writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,conversationContext.requestid,LogLevel.warning);

					conversationContext.C_dS_availability_id = C_dS_availability_id;

					conversationContext.history.push('go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+'] with C_dS_availability_id ['+C_dS_availability_id+']');

					callbackselectcs(null,nextcs.name);

					writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);

					return '';
				}

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addCancelEngageNextCSTool			(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addCancelEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'EngageNextCS',
			description: 'call this tool when the required properties are identified, at that moment your mission is fulfilled.',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
				},
				required: [
					'rationale_for_transfer'
				],
			},
				
		},
		async({ rationale_for_transfer =''}) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (cancel)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);

				let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
				writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,conversationContext.requestid,LogLevel.warning);

				conversationContext.history.push('go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+']');

				callbackselectcs(null,nextcs.name);

				writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);

				return '';

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addScheduleEngageNextCSTool		(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addScheduleEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'EngageNextCS',
			description: 'call this tool when the required properties are identified, at that moment your mission is fulfilled.',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
						C_dS_reservation_id: {
							type: 'integer',
							description: 'the id of the new appointment created by the user',
						},
				},
				required: [
					'rationale_for_transfer',
					'C_dS_reservation_id',
				],
			},
				
		},
		async({ rationale_for_transfer ='', C_dS_reservation_id = -1}) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (schedule)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param C_dS_reservation_id='+C_dS_reservation_id,conversationContext.requestid,LogLevel.warning);

				if(C_dS_reservation_id == undefined || C_dS_reservation_id == 0 || C_dS_reservation_id==-1){
					writeLog(conversationContext.logdate,'gotonext | with error : C_dS_reservation_id is invalid'+nextcs.name,LogLevel.warning);
					return 'error : C_dS_reservation_id is invalid';
				}
				else{
					let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
					writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,conversationContext.requestid,LogLevel.warning);

					conversationContext.C_dS_reservation_id = C_dS_reservation_id;

					conversationContext.history.push('go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+'] with C_dS_reservation_id ['+C_dS_reservation_id+']');

					callbackselectcs(null,nextcs.name);

					writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);

					return '';
				}

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addListEngageNextCSTool			(openai,conversationContext,callbackselectcs){
	try
	{
		if (conversationContext.currentusecase==uc2cancel.name || conversationContext.currentusecase==uc3replan.name) {
			writeLog(conversationContext.logdate,'calling addListEngageNextCSTool (uc2cancel or uc3replan)',conversationContext.requestid,LogLevel.warning);
			openai.addTool(
			{
				name: 'EngageNextCS', // only for cancel and replan !!
				description: 'call this tool when the required properties are identified, at that moment your mission is fulfilled.',
				parameters: {
					type: 'object',
					properties: {
							rationale_for_transfer: {
								type: 'string',
								description: 'The reasoning why this transfer is needed.'
							},
							C_dS_reservation_id: {
								type: 'string',
								description: 'the C_dS_reservation.id of the appointment selected by the user',
							},
					},
					required: [
						'rationale_for_transfer',
						'C_dS_reservation_id',
					]
				},
					
			},
			async({ rationale_for_transfer ='', C_dS_reservation_id = -1}) => { 
				try
				{
					writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (list)',conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'gotonext | with param C_dS_reservation_id='+C_dS_reservation_id,conversationContext.requestid,LogLevel.warning);

					if(conversationContext.currentusecase==uc2cancel || conversationContext.currentusecase==uc3replan){
						if(C_dS_reservation_id == undefined || C_dS_reservation_id == 0 || C_dS_reservation_id==-1){
							writeLog(conversationContext.logdate,'gotonext | with error : C_dS_reservation_id is invalid'+C_dS_reservation_id,conversationContext.requestid,LogLevel.warning);
							return 'error : C_dS_reservation_id is invalid';
						}
					}

					let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
					writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,conversationContext.requestid,LogLevel.warning);

					conversationContext.C_dS_reservation_id = C_dS_reservation_id;

					conversationContext.history.push('gotonext | go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+'] with C_dS_reservation_id ['+C_dS_reservation_id+']');

					callbackselectcs(null,nextcs.name);

					writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);

					return '';

				} catch (error) {
					writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
					writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
					return internalerror;
				}
			});
		}
		else{ //uc4remind
			writeLog(conversationContext.logdate,'calling addListEngageNextCSTool (uc4remind)',conversationContext.requestid,LogLevel.warning);
			openai.addTool(
			{
				name: 'EngageNextCS', // only for uc4remind !
				description: 'call this tool when the required properties are identified, at that moment your mission is fulfilled.',
				parameters: {
					type: 'object',
					properties: {
							rationale_for_transfer: {
								type: 'string',
								description: 'The reasoning why this transfer is needed.'
							},
							reason: {
								type: 'integer',
								enum: [0, 1, 2],
								description:
									'Identifies what the caller wants to further do after you listed their scheduled appointments.\n' +
									'0: the caller wants to cancel an appointment.\n' +
									'1: the caller wants to replan an appointment.\n' +
									'2: the caller is happy with the reminder. Then pass value -1 in the C_dS_reservation_id property\n'
							},
							C_dS_reservation_id: {
								type: 'integer',
								description: 'the C_dS_reservation_id of the appointment as selected by the caller, which is mandatory in use cases cancel and replan.',
							},
					},
					required: [
						'rationale_for_transfer','C_dS_reservation_id','reason'
					],
				},
					
			},
			async({ rationale_for_transfer ='', reason = 0, C_dS_reservation_id = -1}) => { 
				try
				{
					writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (list)',conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'gotonext | with param reason (0=cancel,1=replan,2=nothing)='+reason,conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'gotonext | with param C_dS_reservation_id='+C_dS_reservation_id,conversationContext.requestid,LogLevel.warning);

					if (reason<0 || reason > 2 ){ //nothing to do, go to recap
						writeLog(conversationContext.logdate,'gotonext | with error : reason value is invalid'+C_dS_reservation_id,conversationContext.requestid,LogLevel.warning);
						return 'error : reason value is invalid';
					}
					else 
					{
						if (reason==0 ||reason==1){
							if(C_dS_reservation_id == undefined || C_dS_reservation_id == 0 || C_dS_reservation_id==-1){
								writeLog(conversationContext.logdate,'gotonext | with error : C_dS_reservation_id is invalid'+C_dS_reservation_id,conversationContext.requestid,LogLevel.warning);
								return 'error : C_dS_reservation_id is invalid';
							}
							if (reason==0){ //cancel
								conversationContext.currentusecase = uc2cancel.name;
							}
							else{ //reason==1 = replan
								conversationContext.currentusecase = uc3replan.name;
							}

							let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
							conversationContext.C_dS_reservation_id = C_dS_reservation_id;
							conversationContext.history.push('gotonext | go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+'] with C_dS_reservation_id ['+C_dS_reservation_id+']');
							callbackselectcs(null,nextcs.name);
							writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);
							return '';
						}
						else //reason=2 
						{
							let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
							writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,conversationContext.requestid,LogLevel.warning);
							conversationContext.history.push('gotonext | go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+']');
							callbackselectcs(null,nextcs.name);
							writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);
							return '';
						}
					}
				
				} catch (error) {
					writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
					writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
					return internalerror;
				}
			});
		}
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

function addTestingEngageNextCSTool			(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addTestingEngageNextCSTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'EngageNextCS',
			description: 'this tool must be called once the caller has answered the question',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
				},
				required: [
					'rationale_for_transfer',
				],
			},
				
		},
		async({ rationale_for_transfer =''}) => { 
			try
			{
				writeLog(conversationContext.logdate,'gotonext | execute AI tool EngageNextCS (testing)',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'gotonext | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);

				let nextcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'next',conversationContext.logdate,conversationContext.requestid);
				writeLog(conversationContext.logdate,'gotonext | next cs found:'+nextcs.name,conversationContext.requestid,LogLevel.warning);

				conversationContext.history.push('go to cs ['+nextcs.name+'] for reason ['+rationale_for_transfer+']');

				callbackselectcs(null,nextcs.name);

				writeLog(conversationContext.logdate,'gotonext | end of async EngageNextCS',conversationContext.requestid,LogLevel.verbose);

				return '';

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

//CANCEL UC = GOTO LAST CS (=RECAP) ///////////////////////////////////////////////////////////////////////
function addCancelUCTool					(openai,conversationContext,callbackselectcs){
	try
	{
		writeLog(conversationContext.logdate,'calling addCancelUCTool',conversationContext.requestid,LogLevel.warning);

		openai.addTool(
		{
			name: 'CancelUC',
			description: 'Call this tool if you understand that the caller wants to terminate and discard the ongoing use case.',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this transfer is needed.'
						},
				},
				required: [
					'rationale_for_transfer',
				],
			},
				
		},
		async({ rationale_for_transfer =''}) => { 
			try
			{
				writeLog(conversationContext.logdate,'CancelUC | execute AI tool CancelUC',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'CancelUC | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);

				let lastcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'last',conversationContext.logdate,conversationContext.requestid);
				writeLog(conversationContext.logdate,'CancelUC | last cs found:'+lastcs.name,conversationContext.requestid,LogLevel.warning);
				
				conversationContext.history.push('go to last cs ['+lastcs.name+'] (CancelUC) for reason ['+rationale_for_transfer+']');

				callbackselectcs(null,lastcs.name);
				
				writeLog(conversationContext.logdate,'CancelUC | end of async CancelUC',conversationContext.requestid,LogLevel.verbose);
				
				return '';

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		});
	} catch (error) {
		writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
		writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
	}
}

//INTERNAL TOOLS ////////////////////////////////////////////////////////////////////////////////////////////
function addHangUpTool						(openai,conversationContext,clientws){
	openai.addTool(
		{
			name: 'hang_up',
			description: 'call this tool if the caller decides to quit the conversation, OR if the users says goodbye, OR if you understand that none of our use case options will further help the caller.',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this tool is called.'
						}
				},
				required: [
					'rationale_for_transfer',
				],
			},
		},
		async({ rationale_for_transfer ='' }) => {
			try
			{	
				writeLog(conversationContext.logdate,'hang_up | call tool hang_up',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'hang_up | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				
				conversationContext.history.push('call tool [hang_up] tool for reason ['+rationale_for_transfer+']');
				
				//TODO PASCAL : validate solution for waiting 10sec
				//new Promise(resolve => setTimeout(resolve, 2000)).then(()=>{
				//	//clientws.close();
				conversationContext.forceclose=true;
				//});
				
				writeLog(conversationContext.logdate,'hang_up | end of async hang_up',conversationContext.requestid,LogLevel.verbose);
				
				

				return 'you have to thank the caller for using Mobminder and say "good bye".';

			} catch (error) {
				writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
				writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
				return internalerror;
			}
		}
	);
}



// LOAD GENERAL AI CONTEXT FROM MOBMINDER /////////////////////////////////////////////////////////////////////
//
//
export async function getGeneralAiContext(conversationContext) {
	writeLog(conversationContext.logdate,'retrieving instructions from mobminder api',conversationContext.requestid,LogLevel.verbose);

	//TODO PASCAL : create new config api
	let url = 'https://ai.mobminder.com/query/config_booking.php';
	const params = new URLSearchParams();
	params.append('web', '0');
	params.append('lgn', conversationContext.lgn);  // TMP
	params.append('pwd', conversationContext.pwd);   // TMP >> becomes kid only in the context of booking
	params.append('kid',  conversationContext.kid);
	params.append('mobile', conversationContext.mobile); // config_booking.php will try to identify the visitor straight away.
	params.append('lastname', conversationContext.lastname);
	params.append('firstname', conversationContext.firstname);
	params.append('birthday', conversationContext.birthday);
	//--------------------------------------------------
	let result = await callfetch(conversationContext.logdate,url,params,conversationContext.requestid,true);
	if(result==null){ //invalid mobminder credentials
		writeLog(conversationContext.logdate,'error : retrieving instructions from mobminder : invalid mobminder credentials',conversationContext.requestid,LogLevel.error);
		return null;
	}

	//TODO PASCAL : remove filter
	// result = result.replace(/<role>.*?<\/role>/gs, '');
	// result = result + '\n<information>\n- opening hour = 8h to 22h every day\n- address = 22 rue de la pipette à Bruxelles</information>';

		
	writeLog(conversationContext.logdate,'retrieving instructions from mobminder api='+result,conversationContext.requestid,LogLevel.verbose);
	return result;

}



// MOBMINDER API TOOLS ///////////////////////////////////////////////////////////////////////////////////////////
//
//

function addQueryVisitorsTool				(openai,conversationContext){
	writeLog(conversationContext.logdate,'calling addQueryVisitorsTool',conversationContext.requestid,LogLevel.warning);
    openai.addTool(
        {
			name: 'QueryVisitors',
			description:
			  'Use this tool to indentify the caller\'s file in our system.\n'+
			  'This tool returns a list of C_dS_visitor records matching the given 3 mandatory lookup criteria (firtname, lastname, date of birth) ',
			parameters: {
			  type: 'object',
			  properties: {
				rationale_for_transfer: {
					type: 'string',
					description: 'The reasoning why this tool is called.'
				},
				firstname: {
					type: 'string',
					description:
					'The caller\'s firstname.\n'
				},
				lastname: {
					type: 'string',
					description:
					'The caller\'s lastname.\n'+
					'If the caller\'s speech does not sound precise, ask for a spelling, then re-string the spelled letters and pass them here.'
				},
				yearofbirth: {
					type: 'integer',
					description:
					'The caller\'s year of birth must be in this format: YYYY\n' +
					'the yearofbirth is never before 1901, if so, ask for it again.'
				},
				monthofbirth: {
					type: 'integer',
					description:
					'The caller\'s month of birth must be in this format: MM\n' +
					'the monthofbirth if mandatory and ranges [01:january, ..., 12:december]'
				},
				dayofbirth: {
					type: 'integer',
					description:
					'The caller\'s day of birth must be in this format: DD\n' +
					'the dayofbirth if mandatory and ranges [01, ... ,31]'
				}
			  },
			  required: ['rationale_for_transfer','firstname','lastname','yearofbirth','monthofbirth','dayofbirth']
            }
        },
        async({rationale_for_transfer='', firstname = '', lastname = '', yearofbirth = 0, monthofbirth = 0,dayofbirth = 0}) => {
            try
            {
				writeLog(conversationContext.logdate,'QueryVisitorsTool | calling mobminder API QueryVisitors',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryVisitorsTool | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryVisitorsTool | with param firstname='+firstname,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryVisitorsTool | with param lastname='+lastname,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryVisitorsTool | with param yearofbirth='+yearofbirth,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryVisitorsTool | with param monthofbirth='+monthofbirth,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryVisitorsTool | with param dayofbirth='+dayofbirth,conversationContext.requestid,LogLevel.warning);

				////////////////////////////////////////////////////////////////////////////////////
				//TODO PASCAL : call here the mobminder API
				//https://ai.mobminder.com/query/visitorsbymetaphone.php?bdyear=1934&bdmonth=07&bdday=07&lastname=arnout&firstname=addraien&lgn=PASCAL99@mob!&pwd=2025vanhove&kid=44672&web=1
				////////////////////////////////////////////////////////////////////////////////////
                let url = 'https://ai.mobminder.com/query/visitorsbymetaphone.php';
                const params = new URLSearchParams();
                params.append('web', 0);
                params.append('lgn', conversationContext.lgn);
                params.append('pwd', conversationContext.pwd);
                params.append('kid', conversationContext.kid);
                
				//TODO PASCAL?
				//params.append('mobile', conversationContext.mobile);
				//params.append('lastname', conversationContext.lastname);
				//params.append('firstname', conversationContext.firstname);
				//params.append('birthday', conversationContext.birthday);

	            if(firstname) 	params.append('firstname', firstname);
                if(lastname) 	params.append('lastname', lastname);
				if(yearofbirth)	params.append('bdyear', yearofbirth);
				if(monthofbirth)params.append('bdmonth', monthofbirth);
				if(dayofbirth)	params.append('bdday', dayofbirth);
				
                //if(city) params.append('city', city);
                //if(gender>-1) params.append('gender', gender);
                // if(phoneormobile) params.append('phoneormobile', phoneormobile);
				conversationContext.history.push('call tool [QueryVisitors] with firstname=['+firstname+'], lastname=['+lastname+'] and dob=['+yearofbirth+'/'+monthofbirth+'/'+dayofbirth+'] for reason ['+rationale_for_transfer+']');
                let response = await callfetch(conversationContext.logdate,url,params,conversationContext.requestid,false);
				writeLog(conversationContext.logdate,'QueryVisitorsTool | response='+response,conversationContext.requestid,LogLevel.warning);

				//TODO PASCAL : to explain?
				if(response.includes('Created by AI assistant')){
					writeLog(conversationContext.logdate,'no caller found, please retry',conversationContext.requestid,LogLevel.warning);
					return 'no caller found, please retry';
				}

                return response;
				
				/*if(true){ //simulation
					let result = '{result:\'success\',user:{C_dS_visitor_id:11051856, firstname:\'Bernard\',lastname:\'Spoden\',dateofbirth:\'19/07/1977\'}}';
					writeLog(conversationContext.logdate,'QueryVisitorsTool | result='+result,conversationContext.requestid,LogLevel.warning);
					return result;
				}
				else {
					let result = '{result:\'failure\',error:\'user not found\'}}';
					writeLog(conversationContext.logdate,'QueryVisitorsTool | result='+result,conversationContext.requestid,LogLevel.warning);
					return result;
				}*/
            } catch (error) {
                writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
                writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
                return internalerror;
            }
        }
    );

}
function addAvailabilitiesTool				(openai,conversationContext){
	writeLog(conversationContext.logdate,'calling addAvailabilitiesTool',conversationContext.requestid,LogLevel.warning);
	openai.addTool(
        {
			name: 'Availabilities', // 1024 bytes max/description

			description:
			  'call this tool ONLY once the caller has selected the type of service AND the date from.\n'+
			  'This tool returns a list of C_dS_availability items found from the given type of service and given date.\n'+
			  'the two parameters type of service and date are mandatory.',
			parameters: {
			  type: 'object',
			  properties: {
				rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this tool is called.'
				},
				date: {
				  type: 'string',
				  description:
					'Mandatory. The date from which to start searching the calendar, in ISO 8601 format (YYYY-MM-DD).\n' +
					'This date must be today or in the future.'
				},
				workcode: {
				  type: 'integer',
				  description:
					'Mandatory. Must be one of available C_dS_workcode->id\'s. Please confirm with the caller which workcode to use.\n' +
					'If you are asked to list C_dS_workcode items, report only these fields unless otherwise requested: [C_dS_workcode->name, C_dS_workcode->duration].'
				},
				resourceid: {
				  type: 'integer',
				  description:
					'Mandatory. Is a C_dS_resource->id (agenda) taken from available C_dS_resource->id\'s.\n' +
					'Unless the caller specifies otherwise, default to the primary C_dS_resource->id stated in your role (CONTEXT description).\n' +
					'If the caller names another C_dS_resource, match it to the correct C_dS_resource->id. '
				},
				lookupmode: {
				  type: 'integer',
				  enum: [0, 1, 2, 3],
				  description:
					'Optional. Defines how to search for availabilities in the calendar.\n' +
					'Modes 1, 2, and 3 optimize scheduling by suggesting slots adjacent to existing reservations. The default is mode 3.\n' +
					'0: Sequential scan of all possible time slots that match the C_dS_workcode. ' +
					'Best if the caller wants more availability options inside the same day. Then call this tool again with the same date and lookupmode=0.\n' +
					'1: Picks availabilities adjacent to an existing reservation, or the soonest slot if the day is clear.\n' +
					'2: Picks availabilities adjacent to an existing reservation, or the latest slot if the day is clear.\n' +
					'3: Picks availabilities adjacent to an existing reservation, or both the soonest and latest available slots if the day is clear.'
				}
			  },
			  required: ['rationale_for_transfer','date', 'workcode']
			}
		},
        async({ rationale_for_transfer ='', date, workcode, resourceid, lookupmode = 3 }) => { 
            try
            {
				writeLog(conversationContext.logdate,'Availabilities | calling mobminder API Availabilities',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'Availabilities | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'Availabilities | with param date='+date,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'Availabilities | with param workcode='+workcode,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'Availabilities | with param resourceid='+resourceid,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'Availabilities | with param lookupmode='+lookupmode,conversationContext.requestid,LogLevel.warning);

				////////////////////////////////////////////////////////////////////////////////////
				//TODO PASCAL : call here the mobminder API
				////////////////////////////////////////////////////////////////////////////////////
                /*let url = 'https://ai.mobminder.com/query/availabilities.php';
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
				writeLog(conversationContext.logdate,'Sending command to smartphone: DoPlanningCheckSum + closedrawer + date = '+cleandate,conversationContext.requestid,LogLevel.warning);
   				// clientws.send(JSON.stringify({ status:'DoPlanningCheckSum', date:cleandate, closedrawer:true }));
				clientws.send(JSON.stringify({ status:'Ok', actions: { goToDate:cleandate, closeDrawer:1 }}));
                let response = await callfetch(logdate,url,params,conversationContext.requestid,false);
                return response;*/

				conversationContext.history.push('call tool [Availabilities] with date[='+date+'] and workcode=['+workcode+'] for reason ['+rationale_for_transfer+']' );

				if(true) { //simulation
					let result = [
								{C_dS_availability_id:201, date:'28/06/2025', hour:'10:00'},
								{C_dS_availability_id:202, date:'28/06/2025', hour:'11:00'},
								{C_dS_availability_id:203, date:'29/06/2025', hour:'09:30'},
					];
					result = JSON.stringify(result,null,2);
					writeLog(conversationContext.logdate,'Availabilities | result='+result,conversationContext.requestid,LogLevel.warning);
					return result;
				}
				else
				{
					let result = '[]';
					writeLog(conversationContext.logdate,'Availabilities | result=[]'+result,conversationContext.requestid,LogLevel.warning);
					return result;
				}

            } catch (error) {
                writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
                writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
                return internalerror;
            }
        }
    );

}
function addPostMessage						(openai,conversationContext){
	writeLog(conversationContext.logdate,'calling addPostMessage',conversationContext.requestid,LogLevel.warning);
	openai.addTool(
		{
			name: 'post_message',
			description: 'send a message to the doctor',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this tool is called.'
						},
						message_to_send: {
							type: 'string',
							description: 'the message that the caller wants to send',
						},
				},
				required: [
					'rationale_for_transfer',
					'message_to_send'
				],
			},
		},
		async({ rationale_for_transfer ='',message_to_send='' }) => {
			try
				{
					writeLog(conversationContext.logdate,'post_message | execute AI tool post_message',conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'post_message | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'post_message | with param message_to_send='+message_to_send,conversationContext.requestid,LogLevel.warning);

					////////////////////////////////////////////////////////////////////////////////////
					//TODO PASCAL : call here the mobminder API to send message to doctor
					////////////////////////////////////////////////////////////////////////////////////

					conversationContext.history.push('call tool [post_message] for reason ['+rationale_for_transfer+'] with message ['+message_to_send+']');

					writeLog(conversationContext.logdate,'post_message | end of async post_message',conversationContext.requestid,LogLevel.verbose);

					return 'the message has been successfuly sent';
				} catch (error) {
					writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
					writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
					return internalerror;
				}
		}
	);
}
function addDeleteReservation				(openai,conversationContext){
	writeLog(conversationContext.logdate,'calling addDeleteReservation',conversationContext.requestid,LogLevel.warning);
	openai.addTool(
		{
			name: 'delete_reservation',
			description: 'delete an appointment',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this tool is called.'
						},
				},
				required: [
					'rationale_for_transfer',
				],
			},
		},
		async({ rationale_for_transfer ='' }) => {
			try
				{
					writeLog(conversationContext.logdate,'delete_reservation | execute AI tool delete_reservation',conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'delete_reservation | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);

					if(conversationContext.C_dS_reservation_id == -1)
					{
						writeLog(conversationContext.logdate,'delete_reservation | with error : C_dS_reservation_id is invalid'+conversationContext.C_dS_reservation_id,conversationContext.requestid,LogLevel.warning);
						return 'error : C_dS_reservation_id is invalid';
					}

					////////////////////////////////////////////////////////////////////////////////////
					//TODO PASCAL : call here the mobminder API to delete the reservation
					////////////////////////////////////////////////////////////////////////////////////

					conversationContext.history.push('call tool [delete_reservation] for reason ['+rationale_for_transfer+'] with C_dS_reservation_id ['+conversationContext.C_dS_reservation_id+']');
					
					writeLog(conversationContext.logdate,'delete_reservation | end of async delete_reservation',conversationContext.requestid,LogLevel.verbose);
					
					return 'the appointment has been successfuly deleted';
					
				} catch (error) {
					writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
					writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
					return internalerror;
				}
		}
	);
}
function addPostReservation					(openai,conversationContext){
	writeLog(conversationContext.logdate,'calling addPostReservation',conversationContext.requestid,LogLevel.warning);
	openai.addTool(
		{
			name: 'post_reservation',
			description: 'make a new appointment',
			parameters: {
				type: 'object',
				properties: {
						rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this tool is called.'
						},
						note_to_add_to_appointment: {
							type: 'string',
							description: 'the note that the caller wants to add to the new appointment',
						},
				},
				required: [
					'rationale_for_transfer',
					'note_to_add_to_appointment',
				],
			},
		},
		async({ rationale_for_transfer ='',note_to_add_to_appointment='' }) => {
			try
				{
					writeLog(conversationContext.logdate,'post_reservation | execute AI tool post_reservation',conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'post_reservation | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
					writeLog(conversationContext.logdate,'post_reservation | with param note_to_add_to_appointment='+note_to_add_to_appointment,conversationContext.requestid,LogLevel.warning);
					

					if(conversationContext.C_dS_visitor_id == -1)
					{
						writeLog(conversationContext.logdate,'post_reservation | with error : C_dS_visitor_id is invalid',conversationContext.requestid,LogLevel.warning);
						return 'error : C_dS_visitor_id is invalid';
					}
					if(conversationContext.C_dS_availability_id == -1)
					{
						writeLog(conversationContext.logdate,'post_reservation | with error : C_dS_availability_id is invalid',conversationContext.requestid,LogLevel.warning);
						return 'error : C_dS_availability_id is invalid';
					}
					
					////////////////////////////////////////////////////////////////////////////////////
					//TODO PASCAL : call here the mobminder API to post the reservation
					////////////////////////////////////////////////////////////////////////////////////

					conversationContext.history.push('call tool [post_reservation] for reason ['+rationale_for_transfer+'] with C_dS_visitor_id ['+conversationContext.C_dS_visitor_id+'] and C_dS_availability_id ['+conversationContext.C_dS_availability_id+'] and note ['+note_to_add_to_appointment+']' );
					
					writeLog(conversationContext.logdate,'post_reservation | end of async post_reservation',conversationContext.requestid,LogLevel.verbose);
					
					return 'the appointment has been successfuly added. (new C_dS_visitor_id = 967)';
					
				} catch (error) {
					writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
					writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
					return internalerror;
				}
		}
	);
}
function addQueryReservationTool			(openai,conversationContext){
	writeLog(conversationContext.logdate,'calling addQueryReservationTool',conversationContext.requestid,LogLevel.warning);
	openai.addTool(
        {
			name: 'QueryReservation',
			description:
			  'Returns a list of C_dS_reservation instances involving the specified caller.\n' +
					'Use the #partof# parameter to determine which appointments to retrieve:\n' +
					'# partof = 0: Returns all past and future appointments.\n' +
					'# partof = 1: Returns only past appointments (the caller#s appointment history).\n' +
					'# partof = 2: Returns only future appointments (the caller#s planned appointments).\n' +
					'# partof = -1: Returns the most recent attended appointment (when the caller was last here).\n' +
					'# partof = -2: is the default value. Returns the earliest future appointment (when the caller is next scheduled).\n'
			  ,
			parameters: {
				type: 'object',
				properties: {
					rationale_for_transfer: {
							type: 'string',
							description: 'The reasoning why this tool is called.'
					},
					/*C_dS_visitor_id: {
						type: 'integer',
						description:
						'Mandatory, the caller#s id, that you find here C_dS_visitor->id. Always use the caller\'s lately specified caller.\n'
					},*/
					partof: {
						type: 'integer',
						enum: [-2, -1, 0, 1, 2],
						description:
						  'Allows to query only a part of the caller\'s meetings.\n' +
						  '# partof = 0 returns the full list of written C_dS_reservation instances for the caller.\n' +
						  '# partof = 1 queries only C_dS_reservation instances that were attended in the PAST.\n' +
						  '# partof = 2 queries only C_dS_reservation instances that are planned in the FUTURE.\n' +
						  '# partof = -1 to query the most recent attended C_dS_reservation instance, that is when the caller came last time.\n' +
						  '# partof = -2 to query the first PLANNED C_dS_reservation instance, that is when the caller is scheduled to come next time.'
					}
				},
				required: ['rationale_for_transfer','partof']
            }
        },
        async({ rationale_for_transfer, partof = -2 }) => {
            try
            {
				writeLog(conversationContext.logdate,'QueryReservation | execute AI tool QueryReservation',conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryReservation | with param rationale_for_transfer='+rationale_for_transfer,conversationContext.requestid,LogLevel.warning);
				writeLog(conversationContext.logdate,'QueryReservation | with param partof='+partof,conversationContext.requestid,LogLevel.warning);

                let url = 'https://ai.mobminder.com/query/visiapps.php';
        
                const params = new URLSearchParams();
                params.append('web', 0);
				params.append('lgn', conversationContext.lgn);  //TMP
				params.append('pwd', conversationContext.pwd);   //TMP
				params.append('kid', conversationContext.kid);
				params.append('id', conversationContext.C_dS_visitor_id);
				
                if(partof!=0) params.append('partof', partof);
                // if(phoneormobile) params.append('phoneormobile', phoneormobile);
        
                let response = await callfetch(conversationContext.logdate,url,params,conversationContext.requestid,false);

				conversationContext.history.push('call tool [QueryReservation] with C_dS_visitor_id ['+conversationContext.C_dS_visitor_id+'] and partof ['+partof+'] for reason ['+rationale_for_transfer+']');

				writeLog(conversationContext.logdate,'QueryReservation | end of async post_message',conversationContext.requestid,LogLevel.verbose);

                return response;
            } catch (error) {
                writeLog(conversationContext.logdate,error.message,conversationContext.requestid,LogLevel.error);
                writeLog(conversationContext.logdate,error.stack,conversationContext.requestid,LogLevel.error);
                return internalerror;
            }
        }
    );
}
//LOAD AND INITIALIZE SELECTED CS AND TOOLS  /////////////////////////////////////////////////////////////
//return null if success
//return error message in case of failure (invalid or missing parameters found for selected cs)
export async function initializeCs(clientws,openai,conversationContext,callbackselectcs) {
 	
	//cancel current response if necessary //////////////////////////////////////////////////////////////////
	if(!conversationContext.firstcsselect){ openai.cancelResponse(); }
	conversationContext.aiisresponding=false;

	//load cs instructions ////////////////////////////////////////////////////////////////////////////////
	let currentcs = getCsByUseCaseNameAndCsName(conversationContext.currentusecase,conversationContext.currentcs,'current',conversationContext.logdate,conversationContext.requestid);
    let instructions = currentcs.instruction;
    
	//add json stringified conversation steps to instruction (if exists)
	if(currentcs.conversationSteps != undefined && currentcs.conversationSteps!=null && currentcs.conversationSteps.length>0){
        instructions+= '\n# Conversation Steps:\n'+JSON.stringify(currentcs.conversationSteps,null,2);
    }
	
	let AIcontext=''; //AI context, will be send as text to AI (do not confuse AI instructions and AI context
	
	//initialize cs ////////////////////////////////////////////////////////////////////////////////////////////
	// 1. add specific tools
	// 2. load data from mobminder into AI context (if necessary)

	openai.tools=[]; //reset current AI tools and add new cs specific AI tools
	switch(conversationContext.currentcs){
		case cs01welcome.name:
			addHangUpTool(openai,conversationContext,clientws);
			addEngageNextUseCaseTool(openai,conversationContext,callbackselectcs);
			break;
		case cs02availability.name:
			addHangUpTool(openai,conversationContext,clientws);
			addAvailabilitiesTool(openai,conversationContext)
			addAvailabilitiesEngageNextCSTool(openai,conversationContext,callbackselectcs);
			addCancelUCTool(openai,conversationContext,callbackselectcs);
			break;
		case cs03authentication.name:
			addHangUpTool(openai,conversationContext,clientws);
			addAuthenticationEngageNextCSTool(openai,conversationContext,callbackselectcs);
			addQueryVisitorsTool(openai,conversationContext,clientws);
			break;
		case cs04recap.name:
			addHangUpTool(openai,conversationContext,clientws);
			addEngageNextUseCaseTool(openai,conversationContext,callbackselectcs);
			break;
		case cs05cancel.name:
			addHangUpTool(openai,conversationContext,clientws);
			addCancelEngageNextCSTool(openai,conversationContext,callbackselectcs);
			addCancelUCTool(openai,conversationContext,callbackselectcs);
			addDeleteReservation(openai,conversationContext);
			break;
		case cs06schedule.name:
			addHangUpTool(openai,conversationContext,clientws);
			addScheduleEngageNextCSTool(openai,conversationContext,callbackselectcs);
			addCancelUCTool(openai,conversationContext,callbackselectcs);
			addPostReservation(openai,conversationContext);
			break;
		case cs07list.name:
			addHangUpTool(openai,conversationContext,clientws);
			addListEngageNextCSTool(openai,conversationContext,callbackselectcs);
			addCancelUCTool(openai,conversationContext,callbackselectcs);
			addQueryReservationTool(openai,conversationContext);
			break;
		case cs08message.name:
			addHangUpTool(openai,conversationContext,clientws);
			addMessageEngageNextCSTool(openai,conversationContext,callbackselectcs);
			addPostMessage(openai,conversationContext);
			break;
		case cs09information.name:
			addHangUpTool(openai,conversationContext,clientws);
			addInformationEngageNextCSTool(openai,conversationContext,callbackselectcs);
			addCancelUCTool(openai,conversationContext,callbackselectcs);
			break;
		case cs01test.name:
		case cs02test.name:
			addTestingEngageNextCSTool(openai,conversationContext,callbackselectcs);
			break;
		case cs11test.name:
		case cs12test.name:
			addTestingEngageNextCSTool(openai,conversationContext,callbackselectcs);
			break;
		default:
			break;
	}

	//send AI instructions to AI
	writeLog(conversationContext.logdate,'init cs | updating AI instructions',conversationContext.requestid,LogLevel.warning);
	writeLog(conversationContext.logdate,'init cs | updating AI instructions with : '+instructions,conversationContext.requestid,LogLevel.warning);
	openai.updateSession({ instructions: instructions });
	writeLog(conversationContext.logdate,'init cs | end of selectCs',conversationContext.requestid,LogLevel.verbose);

	
	//do not force AI to talk at the begining of conversation (if firstcsselect=true)
	if(conversationContext.firstcsselect){ 
		conversationContext.firstcsselect=false;
	}
	else{
		//force AI to talk after new cs selection ////////////////////////////////////////////////////////////////
		//openai.createResponse(); //not working
		
		//in case of conversational steps found in cs unde the form of json structure
		if(currentcs.conversationSteps != undefined && currentcs.conversationSteps!=null && currentcs.conversationSteps.length>0){
			writeLog(conversationContext.logdate,'init cs | SEND caller MSG CONTENT TO FORCE AI ANSWER',conversationContext.requestid,LogLevel.warning);
			AIcontext+= 'process the first step ("1_first_step") of the conversation steps and wait a action from the user';
		}
		else //in case of simple instructions set found in cs
		{
			writeLog(conversationContext.logdate,'init cs | FORCE AI ANSWER',conversationContext.requestid,LogLevel.warning);
			AIcontext+= 'process the first step of the conversation steps';
		}
		//send AI context to AI
		writeLog(conversationContext.logdate,'init cs | update AI context with : '+AIcontext,conversationContext.requestid,LogLevel.warning);
		openai.sendUserMessageContent([{ type: 'input_text', text: AIcontext }]);
		conversationContext.aiisresponding=true;
	}
}

