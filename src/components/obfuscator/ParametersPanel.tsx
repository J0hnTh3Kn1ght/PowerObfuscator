import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PIXEL_FONT, type ObfuscationState } from "./options";

interface Props {
  options: ObfuscationState;
  onChange: (patch: Partial<ObfuscationState>) => void;
}

const LABEL_CLS = "text-[11px] uppercase tracking-wider font-mono text-muted-foreground";
const HINT_CLS = "text-[10px] text-muted-foreground mt-1 font-mono";



export function ParametersPanel({ options, onChange }: Props) {
  const commentsDisabled = !options.addCommentsFlag;
  return (
    <>

      <h2 className="text-[10px] uppercase tracking-wider text-muted-foreground" style={PIXEL_FONT}>
        Parameters
      </h2>

      <Card className="p-4 space-y-3">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>

            <Label htmlFor="iterLen" className={LABEL_CLS}>
              Iter length
            </Label>

            <Input
              id="iterLen"
              type="number"
              min={1}
              max={200}
              value={options.iterLength}
              onChange={(e) =>
                onChange({ iterLength: Math.max(1, parseInt(e.target.value || "1", 10)) })
              }
              className="font-mono mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="iterChar" className={LABEL_CLS}>
              Iter charset
            </Label>
          
            <Input
              id="iterChar"
              value={options.iterChar}
              onChange={(e) => onChange({ iterChar: e.target.value })}
              className="font-mono mt-1.5"
              placeholder="f"
            />

            <p className={HINT_CLS}>Single char = repeat · multi-char = random pick</p>
          </div>

          <div>
            <Label htmlFor="commentCount" className={LABEL_CLS}>
              Comment count
            </Label>
          
            <Input
              id="commentCount"
              type="number"
              min={0}
              max={500}
              value={options.commentCount}
              onChange={(e) => onChange({ commentCount: Math.max(0, parseInt(e.target.value || "0", 10)) })}
              className="font-mono mt-1.5"
              disabled={commentsDisabled}
            />

            <p className={HINT_CLS}>Max number of junk comments injected into the script.</p>
          </div>

          <div>
            <Label htmlFor="customComment" className={LABEL_CLS}>
              Custom comment text
            </Label>
          
            <Input
              id="customComment"
              value={options.customCommentText}
              onChange={(e) => onChange({ customCommentText: e.target.value })}
              className="font-mono mt-1.5"
              placeholder="Leave empty to use the default junk comment"
              disabled={commentsDisabled}
            />
            <p className={HINT_CLS}>Overrides the default junk comment when Add comments is on.</p>
          </div>
        </div>

      </Card>
    </>
  );
}
