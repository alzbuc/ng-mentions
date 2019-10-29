import {NthdHighlighterBasic} from './basic/highlighter-basic';
import {NthdHighlighterRegExReplace} from './regex-replace/highlighter-regex-replace';

export const DEMO_DIRECTIVES = [NthdHighlighterBasic, NthdHighlighterRegExReplace];
export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/highlighter-basic'),
    'markup': require('!!raw-loader!./basic/highlighter-basic.html')
  },
  'regex-replace': {
    'code': require('!!raw-loader!./regex-replace/highlighter-regex-replace'),
    'markup': require('!!raw-loader!./regex-replace/highlighter-regex-replace.html')
  }
};