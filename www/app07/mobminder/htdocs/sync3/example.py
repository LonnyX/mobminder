
#####################################################################################
#
#   ATX : contains very specific data matching functions from mobminder format to ATX DentAdmin format
#
#   Usage:
#       - full_init() will setup an initial data synchro between mobminder and this instance of DentAdmin
#       - full_update() updates patients data, and appointments data. The update is bi-derectional. DentAdmin has precedence in case of clash
#


import logging
import requests
import pyodbc
import socket

from datetime import date
from datetime import datetime
from datetime import timedelta

from collections import namedtuple
import os

import mobminder

logger = logging.getLogger("atx")

ROOT_URL = mobminder.ROOT_URL



idsmatch = namedtuple('idsmatch', 'mobId remoteId')

# following functions read from csv format and build SQL

class dS_patient:

	def __init__(self, context):
		self.context = context
		
		self.id = ''
		self.remoteId = ''
		self.birthday = ''
		self.gender = ''
		self.lastname = ''
		self.firstname = ''
		self.mobile = ''
		self.phone = ''
		self.address = ''
		self.zipCode = ''
		self.city = ''
		self.country = ''
		self.email = ''
		self.note = ''

	def hostMatch(self):
		return { 'PatientId':self.remoteId, 'Naam':self.lastname, 'Voornaam':self.firstname, 'Geslacht':self.gender, 'Geboortedatum':self.birthday
					, 'Adres':self.address, 'Postcode':self.zipCode, 'Gemeente':self.city, 'Land':self.country
					, 'Telefoonnummer':self.phone, 'Gsmnummer':self.mobile, 'Emailadres':self.email, 'Memo':self.note }

	def updateFields(self):

		atxFields = self.hostMatch()

		sql = []
		for f, v in atxFields.iteritems():
			if f == 'PatientId': continue
			sql.append(" "+f+"='"+v+"'")
		return ','.join(sql)

	def insertFields(self):

		atxFields = self.hostMatch()

		i = []
		vs = []
		for f, v in atxFields.iteritems():
			if f == 'PatientId': continue
			i.append(" ["+f+"]")
			vs.append(" '"+v+"'")

		i.append(" [Aanspreektitel]")
		vs.append(" '"+self.titel+"'")

		insert = namedtuple('insert', 'inserts values')
		return insert(','.join(i), ','.join(vs))

	def normalize(self): # changes values so they match the expected values in ATX dB

		if self.gender is '0':
			self.gender = 'F'
			self.titel = 'Mevr.'
		else:
			self.gender = 'M'
			self.titel = 'Dhr.'

		if self.birthday == '0': self.birthday = date(1970,12,30)
		else:
			self.birthday = datetime.strptime(self.birthday, '%Y%m%d')
		self.birthday = self.birthday.strftime('%Y-%m-%d')

	def save(self):

		self.normalize()
		dbio = mobminder.db_IO(self.context)

		if self.remoteId=='0': # INSERT

			# mandatory fields in ATX DB that we do not care of in mobminder

			recall = "[Recall],[RecallPeriodInWeeks],[RecallCommunicatieType],[recall2],[recall2PeriodInWeeks]"
			tarief = "[tarief],[standaardVerstrekkerId],[gsmIsDefault],[derdeBetaler],[remgeldViaLeger]"
			color = "[labelColor]"
			nomen = "[nomenclatuurType],[nomenclatuurOrthoLateVerderzetting]"
			ortho = "[tariefOrtho],[orthoNextAppointmentRemember],[nomenclatuurOrthoLateStart]"
			wissel = "[wisselgebitAutoStadium],[chronischZiek],[taalId]"

			nonNullFields = ','+','.join([recall,tarief,color,nomen,ortho,wissel])

			recall = "0,0,1,0,0"
			tarief = "1,1,0,0,0"
			color = "-1"
			nomen = "0,0"
			ortho = "0,0,0"
			wissel = "0,0,1"

			nonNullValues = ','+','.join([recall,tarief,color,nomen,ortho,wissel])

			fields = self.insertFields()

			sql = "INSERT INTO PATIENT ("+fields.inserts+nonNullFields+") VALUES ("+fields.values+nonNullValues+");"

			dbio.cursor.execute(sql)
			dbio.cursor.commit()
			row = dbio.cursor.execute('SELECT SCOPE_IDENTITY() AS id').fetchone()
			self.remoteId = row.id
			rv = idsmatch(self.id, self.remoteId)


		else: # UPDATE

			sql = "UPDATE PATIENT SET "+self.updateFields()+" WHERE PatientId = "+self.remoteId+";"

			dbio.cursor.execute(sql)
			dbio.cursor.commit()

			rv = False

		dbio.close()
		return rv

	def log(self):
		print self.remoteId+': '+self.gender+' '+self.lastname+' '+self.firstname+', '+self.birthday

class dS_resa:

	def __init__(self, context):
		self.context = context
		
		self.id = ''
		self.remoteId = ''
		self.remoteResources = ''
		self.cueIn = ''
		self.cueOut = ''
		self.remoteVisitors = ''
		self.note = ''
		self.performances = ''
		self.colors = ''

	def hostMatch(self):
		return { 'AgendaId':self.remoteId, 'VerstrekkerId':self.remoteResources
					, 'Start':self.cueIn, 'Finish':self.cueOut
					, 'PatientId':self.remoteVisitors, 'Message':'', 'Caption':self.note
					# , 'TBD':self.performances, 'TBD':self.colors
					}

	def updateFields(self):

		atxFields = self.hostMatch()

		sql = []
		for f, v in atxFields.iteritems():
			if f == 'AgendaId': continue # that one is auto-increment
			sql.append(" "+f+"='"+v+"'")
		return ','.join(sql)

	def insertFields(self):

		atxFields = self.hostMatch()

		i = []
		vs = []
		for f, v in atxFields.iteritems():
			if f == 'AgendaId': continue # that one is auto-increment
			i.append(" ["+f+"]")
			vs.append(" '"+v+"'")

		insert = namedtuple('insert', 'inserts values')
		return insert(','.join(i), ','.join(vs))

	def normalize(self): # changes values so they match the expected values in ATX dB

		pass
	
	def actualFinishStart(self): # date only expressed in Excel format, int delta with January 0 1900 (yes, january zero :) 
		excel = datetime(1900,1,1)
		cueIn = datetime.strptime(self.cueIn, '%Y-%m-%d %H:%M:%S')
		cueOut = datetime.strptime(self.cueOut, '%Y-%m-%d %H:%M:%S')
		s = (cueIn - excel).days +2 
		f = (cueOut - excel).days +2 
		return s, f

	def save(self):

		self.normalize()
		dbio = mobminder.db_IO(self.context)

		if self.remoteId=='0': # INSERT

			# mandatory fields in ATX DB that we do not care of in mobminder

			mandatories = "[imported],[EmailVerstuurd]"
			metas = "[ActualStart],[ActualFinish]"
			expressparams = "[ResourceId],[AgendaType],[EventType],[Options],[RecurrenceIndex]"

			nonNullFields = ','+','.join([mandatories,metas,expressparams])

			s,f = self.actualFinishStart()
			
			mandatories = "0,0"
			metas = str(s)+','+str(f)
			expressparams = "1,1,0,2,-1"

			nonNullValues = ','+','.join([mandatories,metas,expressparams])

			fields = self.insertFields()

			sql = "INSERT INTO AGENDA ("+fields.inserts+nonNullFields+") VALUES ("+fields.values+nonNullValues+");"

			dbio.cursor.execute(sql)
			dbio.cursor.commit()
			row = dbio.cursor.execute('SELECT SCOPE_IDENTITY() AS id').fetchone()
			self.remoteId = row.id
			rv = idsmatch(self.id, self.remoteId)


		else: # UPDATE

			sql = "UPDATE AGENDA SET "+self.updateFields()+" WHERE AgendaId = "+self.remoteId+";"

			dbio.cursor.execute(sql)
			dbio.cursor.commit()

			rv = False

		dbio.close()
		return rv

	def log(self):
		print self.remoteId+': '+self.cueIn+' '+self.cueOut+' '+self.note

class File:

	def __init__(self, text, context):
		self.context = context
		
		self.lines = text.split('\n')
		l = len(self.lines)
		self.empty = (l==0 or l==1)

	def csv_getheaders(self):
		line1 = self.lines[0]
		headers = line1.split(';')
		if headers[0] == '0': self.empty = True
		return headers

	def visitors_from_csv(self):
		v = []
		headers = self.csv_getheaders()
		if self.empty: return v
		for c, l in enumerate(self.lines):
			if c == 0: continue # line 1 is the header line
			if l == '': continue # an empty line (most often, the last one :)

			split = l.split(';')
			dS = dS_patient(self.context)
			for p, h in enumerate(headers):
				setattr(dS,h,split[p])
			v.append(dS)

		return v

	def resas_from_csv(self):
		v = []
		headers = self.csv_getheaders()
		if self.empty: return v
		for c, l in enumerate(self.lines):
			if c == 0: continue # line 1 is the header line
			if l == '': continue # an empty line (most often, the last one :)

			split = l.split(';')
			dS = dS_resa(self.context)
			for p, h in enumerate(headers):
				setattr(dS,h,split[p])
			v.append(dS)

		return v


# following functions build a csv format from rows read in DB

def p_csv_from_rows(rows): ## makes a csv from reading in the patients table
	csv = 'remoteId;birthday;gender;lastname;firstname;mobile;phone;address;zipCode;city;country;email;note\n'
	nl = '\n'
	c = ';'
	for row in rows:
		bd = row.Geboortedatum or ''
		if bd is not '':
			bd = str(bd.date()).replace('-','')

		r = { 'id':row.PatientId, 'bd':bd, 'g':row.Geslacht, 'ln':row.Naam, 'fn':row.Voornaam, 'm':row.Gsmnummer, 'p':row.Telefoonnummer, 'a':row.Adres, 'z':row.Postcode, 'y':row.Gemeente, 'c':row.Land, 'e':row.Emailadres, 'n':row.Memo }
		for k, v in r.iteritems():
			r[k] = (v or '') # remove None types

		for k, v in r.iteritems():
			r[k] = (str(v)) # passes everything in string type

		if r['m'] != '': r['m'] = r['m'].replace('-','').replace('.','').replace(' ','').replace('/','')
		if r['p'] != '': r['p'] = r['p'].replace('-','').replace('.','').replace(' ','').replace('/','')
		if r['n'] != '': r['n'] = r['n'].replace('\n',' - ')
		if r['g'] != '': r['g'] = r['g'].replace('M','1').replace('V','0')

		line = c.join([r['id'], r['bd'], r['g'], r['ln'], r['fn'], r['m'], r['p'], r['a'], r['z'], r['y'], r['c'], r['e'], r['n']])

		# print line
		csv = csv+line+nl

	csv = {'file':('export.csv',csv)} # make it a file
	return csv

def a_csv_from_rows(rows): ## makes a csv from reading in the appointments table
	csv = 'remoteId;resources;cueIn;cueOut;visitors;note;performances;colors\n'
	nl = '\n'
	c = ';'
	for row in rows:
		pid = row.ParentId or 0
		rix = row.RecurrenceIndex or 0

		if pid: continue
		if rix != -1: continue

		r = { 'id':row.AgendaId, 'r':row.VerstrekkerId, 'i':row.Start, 'o':row.Finish, 'v':row.PatientId, 't':row.Caption, 'm':row.Message, 'p':'', 'c':'' }
		for k, v in r.iteritems():
			r[k] = (v or '') # remove None types

		for k, v in r.iteritems():
			r[k] = (str(v)) # passes everything in string type

		if r['t'] != '': r['t'] = r['t'].replace('\n',' - ') # title
		if r['m'] != '': r['m'] = r['m'].replace('\n',' - ') # message

		r['n'] = r['t']+' - '+r['m']

		line = c.join([r['id'], r['r'], r['i'], r['o'], r['v'], r['n'], r['p'], r['c']])

		#print line
		csv = csv+line+nl

	csv = {'file':('export.csv',csv)} # make it a file
	return csv

def l_csv_from_rows(rows): ## makes a csv with login details from reading in the verstrekker table
	csv = 'remoteId;firstname;lastname;address;zipCode;city;country;email;phone;mobile\n'
	nl = '\n'
	c = ';'
	for row in rows:

		r = { 'id':row.VerstrekkerID, 'k':row.afkorting, 'ln':row.Naam, 'fn':row.Voornaam, 'm':row.Gsm, 'p':row.Tel, 'a':row.Adres, 'z':row.Postcode, 'y':row.Plaats, 'c':row.Land, 'e':row.Email }
		for k, v in r.iteritems():
			r[k] = (v or '') # fix None types

		for k, v in r.iteritems():
			r[k] = (str(v)) # passes everything in string type   !!!! FIX THE PROBLEM OF E in BLEGIE !!!

		if r['m'] != '': r['m'] = r['m'].replace('-','').replace('.','').replace(' ','').replace('/','')
		if r['p'] != '': r['p'] = r['p'].replace('-','').replace('.','').replace(' ','').replace('/','')

		line = c.join([r['id'], r['fn'], r['ln'], r['a'], r['z'], r['y'], r['c'], r['e'], r['p'], r['m']])

		#print line
		csv = csv+line+nl

	csv = {'file':('export.csv',csv)} # make it a file
	return csv

def r_csv_from_rows(rows): ## makes a csv with resources details from reading in the verstrekker table
	csv = 'remoteId;name;note\n'
	nl = '\n'
	c = ';'
	for row in rows:

		r = { 'id':row.VerstrekkerID, 'k':row.afkorting, 'ln':row.Naam, 'fn':row.Voornaam, 'm':row.Gsm, 'p':row.Tel, 'a':row.Adres, 'z':row.Postcode, 'y':row.Plaats, 'c':row.Land, 'e':row.Email }
		for k, v in r.iteritems():
			r[k] = (v or '') # fix None types

		for k, v in r.iteritems():
			r[k] = (str(v)) # passes everything in string type   !!!! FIX THE PROBLEM OF E in BLEGIE !!!

		if r['m'] != '': r['m'] = r['m'].replace('-','').replace('.','').replace(' ','').replace('/','')
		if r['p'] != '': r['p'] = r['p'].replace('-','').replace('.','').replace(' ','').replace('/','')
		r['k'] = r['fn']+' '+r['ln']
		r['n'] = r['m']+'<br/>'+r['p']+'<br/>'+r['e']

		line = c.join([r['id'], r['k'], r['n']])

		#print line
		csv = csv+line+nl

	csv = {'file':('export.csv',csv)} # make it a file
	return csv

def i_csv_from_inserts(idsmatches): ## makes a csv with remote to local ids matching, for acknowledging update transactions
	csv = 'mobminderId;remoteId\n'
	nl = '\n'
	c = ';'

	for idstuples in idsmatches:
		csv = csv+str(idstuples.mobId)+';'+str(idstuples.remoteId)+nl
	print csv
	csv = {'file':('export.csv',csv)} # make it a file
	return csv


# initialization functions

def r_init(context): # resources init function

	dbio = mobminder.db_IO(context)

	print 'reading from DB'
	fields = 'VerstrekkerID, afkorting, Naam, Voornaam, Adres, Postcode, Plaats, Land, Tel, Gsm, Email, Deleted, DeletionDate'
	dbio.cursor.execute('SELECT '+fields+' FROM VERSTREKKER WHERE (ISNULL(Deleted, 0) = 0);')
	rows = dbio.cursor.fetchall()
	dbio.close()

	print 'sending info to mobminder'
	params = { 'login':context.login, 'passw':context.password, 'clean':'1', 'format':'csv', 'web':'1' }
	response = requests.post(ROOT_URL+'/sync/init/resources.php',data=params,files=r_csv_from_rows(rows))

	# print response.text
	print 'process successfull: resources are initialized to mobminder'

def p_init(context): # patients init function

	dbio = mobminder.db_IO(context)

	print 'reading from DB'
	fields = 'PatientId, Naam, Voornaam, Geslacht, Adres, Postcode, Gemeente, Land, Telefoonnummer, Gsmnummer, Emailadres, Geboortedatum, Memo'
	dbio.cursor.execute('SELECT '+fields+' FROM PATIENT WHERE (ISNULL(Deleted, 0) = 0);')
	rows = dbio.cursor.fetchall()
	dbio.close()

	print 'sending info to mobminder...'
	params = { 'login':context.login, 'passw':context.password, 'clean':'1', 'format':'csv', 'web':'1' }
	response = requests.post(ROOT_URL+'/sync/init/visitors.php',data=params,files=p_csv_from_rows(rows))

	# print response.text
	print 'process successfull: patients are initialized to mobminder'

def a_init(context): # appointments init function

	dbio = mobminder.db_IO(context)

	print 'reading from DB'
	fields = 'AgendaId, PatientId, VerstrekkerId, ParentId, EventType, Start, Finish, Caption, RecurrenceIndex, RecurrenceInfo, Message, Deleted, DeletionDate'
	dbio.cursor.execute('SELECT '+fields+' FROM AGENDA WHERE (ISNULL(Deleted, 0) = 0);')
	rows = dbio.cursor.fetchall()
	dbio.close()

	print 'sending info to mobminder'
	params = { 'login':context.login, 'passw':context.password, 'clean':'1', 'format':'csv', 'web':'1' }
	response = requests.post(ROOT_URL+'/sync/init/appointments.php',data=params,files=a_csv_from_rows(rows))

	# print response.text
	print 'process successfull: appointments are initialized to mobminder'

def full_init():
	context = mobminder.get_context() # mobminder.py
	r_init(context)
	p_init(context)
	a_init(context)



# update functions


def p_update(context): # patients update function

	# check connection to mobminder and request last sync time
	#
	lastsync = mobminder.request_sync_time(context,'vis')

	# check local changes and send to mobminder server
	#
	dbio = mobminder.db_IO(context)

	print 'reading from DB'
	fields = 'PatientId, Naam, Voornaam, Geslacht, Adres, Postcode, Gemeente, Land, Telefoonnummer, Gsmnummer, Emailadres, Geboortedatum, Memo'
	dbio.cursor.execute('SELECT '+fields+' FROM PATIENT WHERE UpdateDate >= \''+lastsync+'\';')
	rows = dbio.cursor.fetchall()
	dbio.close()

	print 'sending the local changes to mobminder'
	params = { 'login':context.login, 'passw':context.password, 'check':'0', 'format':'csv', 'web':'0'}
	response = requests.post(ROOT_URL+'/sync/visitors.php',data=params,files=p_csv_from_rows(rows))


	# read remote changes and update locally
	#
	print 'receiving remote changes from mobminder'
	print '---- mobminder response:'
	print response.text
	print '----'
	# return

	file = File(response.text, context)
	patients = file.visitors_from_csv()
	newids = [] # a list of tuples like mobminderId, remoteId
	for dS in patients:
		dS.log()
		saved = dS.save()
		if saved == False: continue
		newids.append(saved) # that was an insert in atx DB, report the remoteId to mobminder server

	if len(newids):
		print 'acknowledging the transaction to mobminder'
		params = { 'login':context.login, 'passw':context.password, 'class':'visi', 'check':'0', 'format':'csv', 'web':'0'}
		response = requests.post(ROOT_URL+'/sync/acknowledge.php',data=params,files=i_csv_from_inserts(newids))
		print response.text

	print 'done with atx update'

def a_update(context): # appointments update function

	# check connection to mobminder and request last sync time
	#
	lastsync = mobminder.request_sync_time(context,'app')

	# check local changes and send to mobminder server
	#
	dbio = mobminder.db_IO(context)

	print 'reading from DB'
	fields = 'AgendaId, PatientId, VerstrekkerId, ParentId, EventType, Start, Finish, Caption, RecurrenceIndex, RecurrenceInfo, Message, Deleted, DeletionDate'
	dbio.cursor.execute('SELECT '+fields+' FROM AGENDA WHERE UpdateDate >= \''+lastsync+'\';')
	rows = dbio.cursor.fetchall()
	dbio.close()

	print 'sending the local changes to mobminder'
	params = { 'login':context.login, 'passw':context.password, 'check':'0', 'format':'csv', 'web':'0'}
	response = requests.post(ROOT_URL+'/sync/appointments.php',data=params,files=a_csv_from_rows(rows))


	# read remote changes and update locally
	#
	print 'receiving remote changes from mobminder'
	print '---- mobminder response:'
	print response.text
	print '----'
	# return

	file = File(response.text, context)
	resas = file.resas_from_csv()
	newids = [] # a list of tuples like mobId, remoteId
	for dS in resas:
		dS.log()
		saved = dS.save()
		if saved == False: continue
		newids.append(saved) # that was an insert in atx DB, report the remoteId to mobminder server

	if len(newids):
		print 'acknowledging the transaction to mobminder'
		params = { 'login':context.login, 'passw':context.password, 'class':'resa', 'check':'0', 'format':'csv', 'web':'0'}
		response = requests.post(ROOT_URL+'/sync/acknowledge.php',data=params,files=i_csv_from_inserts(newids))
		print response.text

	print 'done with atx update'

def full_update():

	context = mobminder.get_context() # mobminder.py
	p_update(context)
	a_update(context)

	return
	
	
def has_changed():
	return False
	
	
