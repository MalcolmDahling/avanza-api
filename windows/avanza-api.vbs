Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -File ""C:\Users\macda\Documents\Github\avanza-api\windows\avanza-api.ps1""", 0, False
