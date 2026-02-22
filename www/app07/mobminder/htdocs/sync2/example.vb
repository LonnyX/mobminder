Function NouvAgenda(STRURL As String, sLogin As String, sPwd As String, localFile As String)
Dim params As String, MFormData, MRepMob As String, Http As Object, postBody() As Byte, iFileNumber As Integer, mf2 As String
Const MULTIPART_BOUNDARY = "9876543210--------0123456789"
'On Error GoTo NouvAgenda_Err
Dim mf As String: mf = "resources.csv"
mf2 = "patients.txt"

MFormData = GetFile(localFile)
params = "--" & MULTIPART_BOUNDARY & vbCrLf & _
       "Content-Disposition: form-data; name=""login""" & vbCrLf & vbCrLf & sLogin & vbCrLf & _
       "--" & MULTIPART_BOUNDARY & vbCrLf & _
       "Content-Disposition: form-data; name=""passw""" & vbCrLf & vbCrLf & sPwd & vbCrLf & _
       "--" & MULTIPART_BOUNDARY & vbCrLf & _
       "Content-Disposition: form-data; name=""clean""" & vbCrLf & vbCrLf & 1 & vbCrLf & _
       "--" & MULTIPART_BOUNDARY & vbCrLf & _
       "Content-Disposition: form-data; name=""format""" & vbCrLf & vbCrLf & "csv" & vbCrLf & _
       "--" & MULTIPART_BOUNDARY & vbCrLf & _
       "Content-Disposition: form-data; name=""web""" & vbCrLf & vbCrLf & 1 & vbCrLf & _
       "--" & MULTIPART_BOUNDARY & vbCrLf & _
       "Content-Disposition: form-data; name=""files""" & "; filename=""" & mf2 & """" & vbCrLf & _
       "Content-type: application/csv" & vbCrLf & vbCrLf & _
       MFormData & vbCrLf & _
       "--" & MULTIPART_BOUNDARY & "--" & vbCrLf

MsgBox params
'Exit Function

Set Http = CreateObject("WinHttp.WinHttpRequest.5.1")
Http.Open "POST", STRURL, False
'Http.setRequestHeader "Content-Type", "multipart/form-data; charset=ISO-8859-1,UTF-8;boundary=" + MULTIPART_BOUNDARY
Http.setRequestHeader "Accept_Language", "fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3"
Http.setRequestHeader "Accept_Encoding", "gzip,deflate"
Http.setRequestHeader "Accept_Charset", "ISO-8859-1"
Http.setRequestHeader "Content-Type", "multipart/form-data; boundary=" + MULTIPART_BOUNDARY
Http.setRequestHeader "Content-Length", Len(params)
Http.Send params    '& "&files=" & localFile
MRepMob = Http.responseText
MsgBox MRepMob

iFileNumber = FreeFile
Open "C:\gdwin\gd_fr\mobminder\Rep_Mobminder.csv" For Output As #iFileNumber
Print #iFileNumber, MRepMob
Close #iFileNumber

'MsgBox Http.STATUS
FIN:
Set Http = Nothing
Exit Function
NouvAgenda_Err:
  MsgBox "Error " & err.Number & " (" & err.Description
  Resume FIN
End Function