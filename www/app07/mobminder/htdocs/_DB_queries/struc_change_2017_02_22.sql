


ALTER TABLE `globals` ADD `SMSproviderFrNtf` varchar(32) NOT NULL default '' AFTER `sendComm`;
ALTER TABLE `globals` ADD `SMSproviderBeNtf` varchar(32) NOT NULL default '' AFTER `sendComm`;
ALTER TABLE `globals` ADD `SMSproviderInter` varchar(32) NOT NULL default '' AFTER `sendComm`;

update globals set SMSproviderFrNtf = 'Sanofi_NTF_Fr' where id = 1;
update globals set SMSproviderBeNtf = 'Sanofi_NTF_Belg' where id = 1;
update globals set SMSproviderInter = 'Sanofi_NTF_World' where id = 1;