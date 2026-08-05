import { defaultRng } from "./rng";
import {
  addComments,
  addQuotes,
  addValidate,
  randomizeCase,
  removeComments,
  renameVars,
  replaceBooleans,
  replacePwd,
  toOneLiner,
} from "./transforms";

export { entropy } from "./entropy";

export interface ObfuscateOptions {
  iterLength: number;
  iterChar: string;
  oneLiner: boolean;
  removeCommentsFlag: boolean;
  addCommentsFlag: boolean;
  randomizeCaseFlag: boolean;
  addQuoteFlag: boolean;
  addValidateFlag: boolean;
  replaceBooleansFlag: boolean;
  replacePwdFlag: boolean;
  renameVarsFlag: boolean;
  customCommentText?: string;
  commentCount?: number;
}




export function obfuscate(input: string, opts: ObfuscateOptions): string {
  const rng = defaultRng;
  let payload = input;

  if (opts.oneLiner) payload = toOneLiner(payload);
  if (opts.removeCommentsFlag) payload = removeComments(payload);
  if (opts.addValidateFlag) payload = addValidate(payload, opts.oneLiner);
  if (opts.replaceBooleansFlag) payload = replaceBooleans(payload, rng);
  if (opts.replacePwdFlag) payload = replacePwd(payload, rng);
  if (opts.renameVarsFlag) payload = renameVars(payload, opts.iterLength, opts.iterChar || "f", rng);
  if (opts.randomizeCaseFlag) payload = randomizeCase(payload, rng);
  if (opts.addQuoteFlag) payload = addQuotes(payload, rng);
  if (opts.addCommentsFlag) { payload = addComments(payload, opts.oneLiner, rng, opts.customCommentText, opts.commentCount ?? 10,); }
  
  return payload;
}
