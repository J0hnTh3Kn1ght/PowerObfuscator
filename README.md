<img width="1600" height="898" alt="Captura de tela de 2026-08-04 21-18-55" src="https://github.com/user-attachments/assets/f396b6a0-38a2-4b73-b861-4aa29925b629" /></br></br>

![Captura_de_imagem_20240707_125436-removebg-preview](https://github.com/user-attachments/assets/d706ce07-285d-46b0-94fe-fd50e7b60169)
#

| :exclamation:  **Under development**  :exclamation: |

Now that I’ve entered this world of Windows hacking and code obfuscation, while I was digging through the internet looking for stuff about PowerShell for Red Team that’s out there, I noticed that the content from various experts is extremely detailed and informative, but no one has yet created a tool that lets you replicate their valuable tips in a single playground/interface/website (Call it what you want) so you can obfuscate your script.

I enjoyed my trial-and-error experience and experimenting with different combinations of techniques so much that I decided to create this tool.

It’s an obfuscation tool designed for quick, hands-on use, and it combines all the advanced obfuscation techniques I’ve learned and managed to replicate (so far). And it will definitely continue to be updated as I figure out how to combine other obfuscation methods.

> ⚠️ This tool covers advanced obfuscation techniques, but it is intended solely for educational purposes, and under no circumstances should you use the content in environments to which you do not have access or authorization. Always act with responsibility.


# Features

### Shannon Entropy Score && Analysis
****"The greater the entropy, the more likely the data is obfuscated or encrypted, and the more probable the file/payload is malicious"**** - ![PowerShell Obfuscation Bible](https://github.com/t3l3machus/PowerShell-Obfuscation-Bible). Antivirus products use entropy analysis to identify potentially malicious files and payloads, so it's important for you to pay attention to the values. The tool tracks your score as you edit.
### Layers of obfuscation 
Currently, the tool supports 9 editing options that can be combined into various different payloads, and you can increase the level of default obfuscation and customize.
### Client-side
And there are no network calls or server-side logic. It's all yours, and the code is open source so you can edit it however you like.
### Context-Analyzer
Built around a context-aware tokenizer that scans the payload for string-literal boundaries — quoted strings and PowerShell here-strings — before any transform runs. This lets the obfuscator mutate command and parameter names freely while leaving literal string content untouched, keeping the syntax intact.
### File Upload && Download
The tool reads the contents of files (.ps1 and .txt) that you can upload and doesn't rely solely on copy-and-paste input. You can also download your creation.


#### - And there's more to come...

----------------------------------------------

# Obfuscation Layers:

  | Technique | Description |
|--------|-------------|
| **One-Liner** | Flattens the script into a single line, stripping line breaks and inline comments |
| **Remove Comments** | Removes old Comments and Strips block (`<# #>`) and line (`#`) comments |
| **Anti-Analysis** | Prepends a stub that checks CPU core count, RAM, and execution timing, exiting early if the environment looks virtualized and evades dynamic analysis |
| **Boolean Replacement** | Swaps `$true` / `$false` literals for equivalent type-cast expressions |
| **Command Replacement (PWD)** | Swaps `pwd` calls for equivalent expressions (`gl`, `Get-Location`, etc.) |
| **Variable Renaming** | Renames every declared variable to a randomized identifier (configurable length and charset) |
| **Case Randomization** | Randomizes the casing of cmdlet and parameter names, skipping string literals |
| **Cmdlet Quote Interruption** | Wraps random substrings of cmdlet/parameter names in quotes, skipping string literals |
| **Comment Injection** | Inserts custom or default comments at safe positions, skipping string literals |

> ! Updates featuring additional layers and obfuscation and encryption techniques will be released

----------------------------------------------

# Special Thanks & Research Sources:

![character](https://github.com/user-attachments/assets/7a02a73b-b8fe-4917-8d07-2a0261dab25b)

- Thank you to these developers for their work

They're the best: @danielbohannon, @klezVirus, @t3l3machus and others.

#### Source:
- https://github.com/t3l3machus/PowerShell-Obfuscation-Bible
- https://www.youtube.com/watch?v=tGFdmAh_lXE
- https://www.datatechguard.com/powershell-obfuscation-stealth-confusion/
- https://darkbyte.net/ofuscando-scripts-de-powershell-con-invoke-stealth/
- https://www.wietzebeukema.nl/blog/powershell-obfuscation-using-securestring
