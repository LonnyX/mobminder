
-- 3009 = GSK

-- ---------------------------------------------------------------------------------------
-- Remove visitors and appointments, clean up an account from previous usage
--

	-- ARCHIVES 
	
delete archive_attendees from archive_attendees
	inner join archive_reservations on archive_reservations.id = archive_attendees.groupId
	where archive_reservations.groupId = 3009;

delete archive_att_visitors from archive_att_visitors
	inner join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
	where archive_reservations.groupId = 3009;
	
delete archive_performances from archive_performances
	inner join archive_reservations on archive_reservations.id = archive_performances.groupId
	where archive_reservations.groupId = 3009;



	-- RECENT
	
delete attendees from attendees
	inner join reservations on reservations.id = attendees.groupId
	where reservations.groupId = 3009; 

delete att_visitors from att_visitors
	inner join reservations on reservations.id = att_visitors.groupId
	where reservations.groupId = 3009; 

delete comm_toggles from comm_toggles
	inner join reservations on reservations.id = comm_toggles.reservationId
	where reservations.groupId = 3009; 
	
delete performances from performances
	inner join reservations on reservations.id = performances.groupId
	where reservations.groupId = 3009; 
	


	
	-- COMMS 
	
delete sms from sms
	inner join reservations on reservations.id = sms.reservationId
	where reservations.groupId = 3009; 

delete emails from emails
	inner join reservations on reservations.id = emails.reservationId
	where reservations.groupId = 3009; 
	
	
delete sms from sms
	inner join archive_reservations on archive_reservations.id = sms.reservationId
	where archive_reservations.groupId = 3009;

delete emails from emails
	inner join archive_reservations on archive_reservations.id = emails.reservationId
	where archive_reservations.groupId = 3009;
	

	
	-- MAIN
delete from archive_reservations where archive_reservations.groupId = 3009;
delete from reservations where reservations.groupId = 3009;
delete from resa_series where resa_series.groupId = 3009;


	-- also remove visitors ? 
delete from visitors where visitors.groupId = 3009;

