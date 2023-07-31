export const styleProperties = Object.freeze([
    'direction',
    'boxSizing',
    'width',
    'height', 'minHeight', 'minWidth', 'overflowX',
    'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
    'textAlign', 'textTransform', 'textIndent',
    'textDecoration',
    'letterSpacing', 'wordSpacing',
    'tabSize', 'MozTabSize'
]);
const isBrowser = typeof window !== 'undefined';
const isFirefox = isBrowser && window.mozInnerScreenX != null;
// eslint-disable-next-line max-len
const mobileRegEx = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
// eslint-disable-next-line max-len
const mobileRegEx2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
export function isMobileOrTablet() {
    const agent = navigator.userAgent || navigator.vendor || window.opera;
    return mobileRegEx.test(agent) || mobileRegEx2.test(agent.substr(0, 4));
}
function isInputOrTextAreaElement(element) {
    return element !== null &&
        (element.nodeName.toUpperCase() === 'INPUT' || element.nodeName.toUpperCase() === 'TEXTAREA' || element.nodeName === '#text');
}
function spliceString(value, start, end, insert) {
    return value.substring(0, start) + insert + value.substring(end) + '';
}
function iterateMentionsMarkup(value, mentionMarkup, textIterator, markupIterator, displayTransform) {
    let match;
    let start = 0;
    let currentPlainTextIndex = 0;
    const regEx = mentionMarkup.regEx;
    regEx.lastIndex = 0;
    while ((match = regEx.exec(value)) !== null) {
        const display = displayTransform(...match);
        const substr = value.substring(start, match.index);
        textIterator(substr, start, currentPlainTextIndex);
        currentPlainTextIndex += substr.length;
        markupIterator(match[0], match.index, currentPlainTextIndex, display);
        currentPlainTextIndex += display.length;
        start = regEx.lastIndex;
    }
    if (start < value.length) {
        textIterator(value.substring(start), start, currentPlainTextIndex);
    }
}
function iterateOnlyMentionsMarkup(value, mentionMarkup, markupIterator, displayTransform) {
    let match;
    let start = 0;
    let currentPlainTextIndex = 0;
    const regEx = mentionMarkup.regEx;
    regEx.lastIndex = 0;
    while ((match = regEx.exec(value)) !== null) {
        const display = displayTransform(...match);
        const substr = value.substring(start, match.index);
        currentPlainTextIndex += substr.length;
        markupIterator(match[0], match.index, currentPlainTextIndex, display);
        currentPlainTextIndex += display.length;
        start = regEx.lastIndex;
    }
}
export function mapPlainTextIndex(value, mentionMarkup, indexInPlainText, toEndOfMarkup, displayTransform) {
    if (isNaN(indexInPlainText)) {
        return indexInPlainText;
    }
    let result;
    const textIterator = (matchString, index, substringPlainTextIndex) => {
        if (typeof result !== 'undefined') {
            return;
        }
        if (substringPlainTextIndex + matchString.length >= indexInPlainText) {
            result = index + indexInPlainText - substringPlainTextIndex;
        }
    };
    const markupIterator = (matchString, index, mentionPlainTextIndex, display) => {
        if (typeof result !== 'undefined') {
            return;
        }
        if (mentionPlainTextIndex + display.length > indexInPlainText) {
            result = index + (toEndOfMarkup ? matchString.length : 0);
        }
    };
    iterateMentionsMarkup(value, mentionMarkup, textIterator, markupIterator, displayTransform);
    return typeof result !== 'undefined' ? result : value.length;
}
export function getCaretPosition(element) {
    if (isInputOrTextAreaElement(element)) {
        const value = element.value;
        return value.slice(0, element.selectionStart).length - (isMobileOrTablet() ? 1 : 0);
    }
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return range.startOffset;
    }
    return 0;
}
export function getCaretCoordinates(element, position) {
    let coords = { top: 0, left: 0 };
    if (!isBrowser) {
        return coords;
    }
    const div = document.createElement('div');
    document.body.appendChild(div);
    const style = div.style;
    const computed = getElementStyle(element);
    style.whiteSpace = 'pre-wrap';
    if (element.nodeName !== 'INPUT') {
        style.wordWrap = 'break-word';
    }
    style.position = 'absolute';
    style.visibility = 'hidden';
    styleProperties.forEach(prop => style[prop] = computed[prop]);
    if (isFirefox) {
        if (element.scrollHeight > parseInt(computed.height, 10)) {
            style.overflowY = 'scroll';
        }
    }
    else {
        style.overflow = 'hidden';
    }
    div.textContent = element.value.substring(0, position);
    if (element.nodeName === 'INPUT') {
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');
    }
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    let scrollTop = 0;
    if (element.scrollTop > 0) {
        scrollTop = element.scrollTop;
    }
    coords = {
        top: span.offsetTop + parseInt(computed['borderTopWidth'], 10) - scrollTop,
        left: span.offsetLeft + parseInt(computed['borderLeftWidth'], 10)
    };
    document.body.removeChild(div);
    return coords;
}
export function getElementStyle(element, property) {
    const style = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;
    if (property && typeof property === 'string' && typeof style[property] !== 'undefined') {
        return style[property];
    }
    else if (property && typeof property === 'string') {
        return null;
    }
    return style;
}
export function setCaretPosition(element, position) {
    if (isInputOrTextAreaElement(element) && element.selectionStart !== undefined) {
        element.focus();
        element.setSelectionRange(position, position);
        element.selectionStart = position;
    }
    else {
        const range = document.createRange();
        range.setStart(element, position);
        range.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
export function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
export function markupToRegExp(markup) {
    const placeholderRegExp = /__([\w]+)__/g;
    const placeholderExclusion = '^\\)\\]';
    let markupPattern = escapeRegExp(markup);
    const placeholders = {};
    let match;
    let i = 1;
    do {
        match = placeholderRegExp.exec(markupPattern);
        if (match) {
            const placeholder = match[1];
            markupPattern = markupPattern.replace(`__${placeholder}__`, `([${placeholderExclusion}]+)`);
            placeholders[placeholder] = ++i;
        }
    } while (match);
    return { markup, regEx: new RegExp('(' + markupPattern + ')', 'ig'), groups: placeholders };
}
export function getPlainText(value, mentionMarkup, displayTransform) {
    mentionMarkup.regEx.lastIndex = 0;
    return value.replace(mentionMarkup.regEx, displayTransform);
}
export function replacePlaceholders(item, markupMention) {
    let result = markupMention.markup + '';
    Object.keys(markupMention.groups)
        .forEach(key => result = result.replace(new RegExp(`__${key}__`, 'g'), typeof item === 'string' ? item : item[key]));
    return result;
}
export function applyChangeToValue(value, markupMention, plainTextValue, selectionStartBeforeChange = 0, selectionEndBeforeChange = 0, selectionEndAfterChange = 0, displayTransform) {
    const oldPlainTextValue = getPlainText(value, markupMention, displayTransform);
    const lengthDelta = oldPlainTextValue.length - plainTextValue.length;
    /** fix issue when first character changing **/
    /*  if (!selectionStartBeforeChange) {
        selectionStartBeforeChange = selectionEndBeforeChange + lengthDelta;
      }
      if (!selectionEndBeforeChange) {
        selectionEndBeforeChange = selectionStartBeforeChange;
      }*/
    if (selectionStartBeforeChange === selectionEndBeforeChange && selectionEndBeforeChange === selectionEndAfterChange &&
        oldPlainTextValue.length === plainTextValue.length) {
        selectionStartBeforeChange--;
    }
    const insert = plainTextValue.slice(selectionStartBeforeChange, selectionEndAfterChange);
    const spliceStart = Math.min(selectionStartBeforeChange, selectionEndAfterChange);
    let spliceEnd = selectionEndBeforeChange;
    if (selectionStartBeforeChange === selectionEndAfterChange) {
        spliceEnd = Math.max(selectionEndBeforeChange, selectionStartBeforeChange + lengthDelta);
    }
    return spliceString(value, mapPlainTextIndex(value, markupMention, spliceStart, false, displayTransform), mapPlainTextIndex(value, markupMention, spliceEnd, true, displayTransform), insert);
}
export function findStartOfMentionInPlainText(value, mentionMarkup, indexInPlainText, displayTransform) {
    let result = { start: -1, end: -1 };
    const markupIterator = (matchString, index, mentionPlainTextIndex, display) => {
        if (mentionPlainTextIndex < indexInPlainText && mentionPlainTextIndex + display.length > indexInPlainText) {
            result = { start: mentionPlainTextIndex, end: mentionPlainTextIndex + display.length };
            return true;
        }
        return false;
    };
    iterateOnlyMentionsMarkup(value, mentionMarkup, markupIterator, displayTransform);
    return result;
}
export function getBoundsOfMentionAtPosition(value, mentionMarkup, indexInPlainText, displayTransform) {
    return findStartOfMentionInPlainText(value, mentionMarkup, indexInPlainText, displayTransform);
}
export function escapeHtml(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function isCoordinateWithinRect(rect, x, y) {
    return (rect.left < x && x < rect.right) && (rect.top < y && y < rect.bottom);
}
export class Highlighted {
    constructor(element, type = null) {
        this.element = element;
        this.type = type;
    }
    get clientRect() {
        return this.element.getBoundingClientRect();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQyxXQUFXO0lBQ1gsV0FBVztJQUNYLE9BQU87SUFDUCxRQUFRLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXO0lBQzlDLFdBQVc7SUFFWCxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxhQUFhO0lBRTNGLFlBQVksRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLGFBQWE7SUFFNUQsd0RBQXdEO0lBQ3hELFdBQVcsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLFlBQVk7SUFFakgsV0FBVyxFQUFFLGVBQWUsRUFBRSxZQUFZO0lBQzFDLGdCQUFnQjtJQUVoQixlQUFlLEVBQUUsYUFBYTtJQUU5QixTQUFTLEVBQUUsWUFBWTtDQUN4QixDQUFDLENBQUM7QUFDSCxNQUFNLFNBQVMsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUM7QUFDaEQsTUFBTSxTQUFTLEdBQUcsU0FBUyxJQUFVLE1BQU8sQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDO0FBRXJFLG1DQUFtQztBQUNuQyxNQUFNLFdBQVcsR0FBRyxxVkFBcVYsQ0FBQztBQUMxVyxtQ0FBbUM7QUFDbkMsTUFBTSxZQUFZLEdBQUcseWtEQUF5a0QsQ0FBQztBQUMvbEQsTUFBTSxVQUFVLGdCQUFnQjtJQUM5QixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUssTUFBYyxDQUFDLEtBQUssQ0FBQztJQUMvRSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksWUFBWSxDQUFD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LE1BQU0sQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFFRCxNQUFNLE9BQU8sV0FBVztJQUN0QixZQUE0QixPQUFnQixFQUFrQixPQUFlLElBQUk7UUFBckQsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFrQixTQUFJLEdBQUosSUFBSSxDQUFlO0lBQUcsQ0FBQztJQUVyRixJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgc3R5bGVQcm9wZXJ0aWVzID0gT2JqZWN0LmZyZWV6ZShbXG4gICdkaXJlY3Rpb24nLCAgLy8gUlRMIHN1cHBvcnRcbiAgJ2JveFNpemluZycsXG4gICd3aWR0aCcsICAvLyBvbiBDaHJvbWUgYW5kIElFLCBleGNsdWRlIHRoZSBzY3JvbGxiYXIsIHNvIHRoZSBtaXJyb3IgZGl2IHdyYXBzIGV4YWN0bHkgYXMgdGhlIHRleHRhcmVhIGRvZXNcbiAgJ2hlaWdodCcsICdtaW5IZWlnaHQnLCAnbWluV2lkdGgnLCAnb3ZlcmZsb3dYJyxcbiAgJ292ZXJmbG93WScsICAvLyBjb3B5IHRoZSBzY3JvbGxiYXIgZm9yIElFXG5cbiAgJ2JvcmRlclRvcFdpZHRoJywgJ2JvcmRlclJpZ2h0V2lkdGgnLCAnYm9yZGVyQm90dG9tV2lkdGgnLCAnYm9yZGVyTGVmdFdpZHRoJywgJ2JvcmRlclN0eWxlJyxcblxuICAncGFkZGluZ1RvcCcsICdwYWRkaW5nUmlnaHQnLCAncGFkZGluZ0JvdHRvbScsICdwYWRkaW5nTGVmdCcsXG5cbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL2ZvbnRcbiAgJ2ZvbnRTdHlsZScsICdmb250VmFyaWFudCcsICdmb250V2VpZ2h0JywgJ2ZvbnRTdHJldGNoJywgJ2ZvbnRTaXplJywgJ2ZvbnRTaXplQWRqdXN0JywgJ2xpbmVIZWlnaHQnLCAnZm9udEZhbWlseScsXG5cbiAgJ3RleHRBbGlnbicsICd0ZXh0VHJhbnNmb3JtJywgJ3RleHRJbmRlbnQnLFxuICAndGV4dERlY29yYXRpb24nLCAgLy8gbWlnaHQgbm90IG1ha2UgYSBkaWZmZXJlbmNlLCBidXQgYmV0dGVyIGJlIHNhZmVcblxuICAnbGV0dGVyU3BhY2luZycsICd3b3JkU3BhY2luZycsXG5cbiAgJ3RhYlNpemUnLCAnTW96VGFiU2l6ZSdcbl0pO1xuY29uc3QgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5jb25zdCBpc0ZpcmVmb3ggPSBpc0Jyb3dzZXIgJiYgKDxhbnk+d2luZG93KS5tb3pJbm5lclNjcmVlblggIT0gbnVsbDtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbmNvbnN0IG1vYmlsZVJlZ0V4ID0gLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWlub3xhbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbmNvbnN0IG1vYmlsZVJlZ0V4MiA9IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pO1xuZXhwb3J0IGZ1bmN0aW9uIGlzTW9iaWxlT3JUYWJsZXQoKSB7XG4gIGNvbnN0IGFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8ICh3aW5kb3cgYXMgYW55KS5vcGVyYTtcbiAgcmV0dXJuIG1vYmlsZVJlZ0V4LnRlc3QoYWdlbnQpIHx8IG1vYmlsZVJlZ0V4Mi50ZXN0KGFnZW50LnN1YnN0cigwLCA0KSk7XG59XG5cbmZ1bmN0aW9uIGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbGVtZW50PzogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIGVsZW1lbnQgIT09IG51bGwgJiZcbiAgICAgIChlbGVtZW50Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdJTlBVVCcgfHwgZWxlbWVudC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnVEVYVEFSRUEnIHx8IGVsZW1lbnQubm9kZU5hbWUgPT09ICcjdGV4dCcpO1xufVxuXG5mdW5jdGlvbiBzcGxpY2VTdHJpbmcodmFsdWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGluc2VydDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnN1YnN0cmluZygwLCBzdGFydCkgKyBpbnNlcnQgKyB2YWx1ZS5zdWJzdHJpbmcoZW5kKSArICcnO1xufVxuXG5mdW5jdGlvbiBpdGVyYXRlTWVudGlvbnNNYXJrdXAoXG4gICAgdmFsdWU6IHN0cmluZywgbWVudGlvbk1hcmt1cDogTWFya3VwTWVudGlvbiwgdGV4dEl0ZXJhdG9yOiAoLi4uXzogYW55W10pID0+IHZvaWQsXG4gICAgbWFya3VwSXRlcmF0b3I6ICguLi5fOiBhbnlbXSkgPT4gdm9pZCwgZGlzcGxheVRyYW5zZm9ybTogKC4uLl86IHN0cmluZ1tdKSA9PiBzdHJpbmcpIHtcbiAgbGV0IG1hdGNoOyBsZXQgc3RhcnQgPSAwO1xuICBsZXQgY3VycmVudFBsYWluVGV4dEluZGV4ID0gMDtcbiAgY29uc3QgcmVnRXggPSBtZW50aW9uTWFya3VwLnJlZ0V4O1xuICByZWdFeC5sYXN0SW5kZXggPSAwO1xuICB3aGlsZSAoKG1hdGNoID0gcmVnRXguZXhlYyh2YWx1ZSkpICE9PSBudWxsKSB7XG4gICAgY29uc3QgZGlzcGxheSA9IGRpc3BsYXlUcmFuc2Zvcm0oLi4ubWF0Y2gpO1xuICAgIGNvbnN0IHN1YnN0ciA9IHZhbHVlLnN1YnN0cmluZyhzdGFydCwgbWF0Y2guaW5kZXgpO1xuICAgIHRleHRJdGVyYXRvcihzdWJzdHIsIHN0YXJ0LCBjdXJyZW50UGxhaW5UZXh0SW5kZXgpO1xuICAgIGN1cnJlbnRQbGFpblRleHRJbmRleCArPSBzdWJzdHIubGVuZ3RoO1xuICAgIG1hcmt1cEl0ZXJhdG9yKG1hdGNoWzBdLCBtYXRjaC5pbmRleCwgY3VycmVudFBsYWluVGV4dEluZGV4LCBkaXNwbGF5KTtcbiAgICBjdXJyZW50UGxhaW5UZXh0SW5kZXggKz0gZGlzcGxheS5sZW5ndGg7XG4gICAgc3RhcnQgPSByZWdFeC5sYXN0SW5kZXg7XG4gIH1cblxuICBpZiAoc3RhcnQgPCB2YWx1ZS5sZW5ndGgpIHtcbiAgICB0ZXh0SXRlcmF0b3IodmFsdWUuc3Vic3RyaW5nKHN0YXJ0KSwgc3RhcnQsIGN1cnJlbnRQbGFpblRleHRJbmRleCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXRlcmF0ZU9ubHlNZW50aW9uc01hcmt1cChcbiAgICB2YWx1ZTogc3RyaW5nLCBtZW50aW9uTWFya3VwOiBNYXJrdXBNZW50aW9uLCBtYXJrdXBJdGVyYXRvcjogKC4uLl86IGFueVtdKSA9PiBib29sZWFuLFxuICAgIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nKSB7XG4gIGxldCBtYXRjaDsgbGV0IHN0YXJ0ID0gMDsgbGV0IGN1cnJlbnRQbGFpblRleHRJbmRleCA9IDA7XG4gIGNvbnN0IHJlZ0V4ID0gbWVudGlvbk1hcmt1cC5yZWdFeDtcbiAgcmVnRXgubGFzdEluZGV4ID0gMDtcbiAgd2hpbGUgKChtYXRjaCA9IHJlZ0V4LmV4ZWModmFsdWUpKSAhPT0gbnVsbCkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBkaXNwbGF5VHJhbnNmb3JtKC4uLm1hdGNoKTtcbiAgICBjb25zdCBzdWJzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoc3RhcnQsIG1hdGNoLmluZGV4KTtcbiAgICBjdXJyZW50UGxhaW5UZXh0SW5kZXggKz0gc3Vic3RyLmxlbmd0aDtcbiAgICBtYXJrdXBJdGVyYXRvcihtYXRjaFswXSwgbWF0Y2guaW5kZXgsIGN1cnJlbnRQbGFpblRleHRJbmRleCwgZGlzcGxheSk7XG4gICAgY3VycmVudFBsYWluVGV4dEluZGV4ICs9IGRpc3BsYXkubGVuZ3RoO1xuICAgIHN0YXJ0ID0gcmVnRXgubGFzdEluZGV4O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQbGFpblRleHRJbmRleChcbiAgICB2YWx1ZTogc3RyaW5nLCBtZW50aW9uTWFya3VwOiBNYXJrdXBNZW50aW9uLCBpbmRleEluUGxhaW5UZXh0OiBudW1iZXIsIHRvRW5kT2ZNYXJrdXA6IGJvb2xlYW4sXG4gICAgZGlzcGxheVRyYW5zZm9ybTogKC4uLl86IHN0cmluZ1tdKSA9PiBzdHJpbmcpOiBudW1iZXIge1xuICBpZiAoaXNOYU4oaW5kZXhJblBsYWluVGV4dCkpIHtcbiAgICByZXR1cm4gaW5kZXhJblBsYWluVGV4dDtcbiAgfVxuXG4gIGxldCByZXN1bHQ7XG4gIGNvbnN0IHRleHRJdGVyYXRvciA9IChtYXRjaFN0cmluZzogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBzdWJzdHJpbmdQbGFpblRleHRJbmRleDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzdWJzdHJpbmdQbGFpblRleHRJbmRleCArIG1hdGNoU3RyaW5nLmxlbmd0aCA+PSBpbmRleEluUGxhaW5UZXh0KSB7XG4gICAgICByZXN1bHQgPSBpbmRleCArIGluZGV4SW5QbGFpblRleHQgLSBzdWJzdHJpbmdQbGFpblRleHRJbmRleDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG1hcmt1cEl0ZXJhdG9yID0gKG1hdGNoU3RyaW5nOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIG1lbnRpb25QbGFpblRleHRJbmRleDogbnVtYmVyLCBkaXNwbGF5OiBzdHJpbmcpID0+IHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobWVudGlvblBsYWluVGV4dEluZGV4ICsgZGlzcGxheS5sZW5ndGggPiBpbmRleEluUGxhaW5UZXh0KSB7XG4gICAgICByZXN1bHQgPSBpbmRleCArICh0b0VuZE9mTWFya3VwID8gbWF0Y2hTdHJpbmcubGVuZ3RoIDogMCk7XG4gICAgfVxuICB9O1xuXG4gIGl0ZXJhdGVNZW50aW9uc01hcmt1cCh2YWx1ZSwgbWVudGlvbk1hcmt1cCwgdGV4dEl0ZXJhdG9yLCBtYXJrdXBJdGVyYXRvciwgZGlzcGxheVRyYW5zZm9ybSk7XG5cbiAgcmV0dXJuIHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnID8gcmVzdWx0IDogdmFsdWUubGVuZ3RoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FyZXRQb3NpdGlvbihlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KTogbnVtYmVyIHtcbiAgaWYgKGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbGVtZW50KSkge1xuICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICByZXR1cm4gdmFsdWUuc2xpY2UoMCwgZWxlbWVudC5zZWxlY3Rpb25TdGFydCkubGVuZ3RoIC0gKGlzTW9iaWxlT3JUYWJsZXQoKSA/IDEgOiAwKTtcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgaWYgKHNlbGVjdGlvbi5yYW5nZUNvdW50ID4gMCkge1xuICAgIGNvbnN0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XG4gICAgcmV0dXJuIHJhbmdlLnN0YXJ0T2Zmc2V0O1xuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXJldENvb3JkaW5hdGVzKGVsZW1lbnQ6IEhUTUxUZXh0QXJlYUVsZW1lbnQsIHBvc2l0aW9uOiBudW1iZXIpOiB7dG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcn0ge1xuICBsZXQgY29vcmRzID0ge3RvcDogMCwgbGVmdDogMH07XG4gIGlmICghaXNCcm93c2VyKSB7XG4gICAgcmV0dXJuIGNvb3JkcztcbiAgfVxuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICBjb25zdCBzdHlsZSA9IGRpdi5zdHlsZTtcbiAgY29uc3QgY29tcHV0ZWQgPSBnZXRFbGVtZW50U3R5bGUoZWxlbWVudCk7XG4gIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnO1xuICBpZiAoZWxlbWVudC5ub2RlTmFtZSAhPT0gJ0lOUFVUJykge1xuICAgIHN0eWxlLndvcmRXcmFwID0gJ2JyZWFrLXdvcmQnO1xuICB9XG4gIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICBzdHlsZVByb3BlcnRpZXMuZm9yRWFjaChwcm9wID0+IHN0eWxlW3Byb3BdID0gY29tcHV0ZWRbcHJvcF0pO1xuICBpZiAoaXNGaXJlZm94KSB7XG4gICAgaWYgKGVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID4gcGFyc2VJbnQoY29tcHV0ZWQuaGVpZ2h0LCAxMCkpIHtcbiAgICAgIHN0eWxlLm92ZXJmbG93WSA9ICdzY3JvbGwnO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICB9XG4gIGRpdi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKDAsIHBvc2l0aW9uKTtcbiAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCcpIHtcbiAgICBkaXYudGV4dENvbnRlbnQgPSBkaXYudGV4dENvbnRlbnQucmVwbGFjZSgvXFxzL2csICdcXHUwMGEwJyk7XG4gIH1cblxuICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBzcGFuLnRleHRDb250ZW50ID0gZWxlbWVudC52YWx1ZS5zdWJzdHJpbmcocG9zaXRpb24pIHx8ICcuJztcbiAgZGl2LmFwcGVuZENoaWxkKHNwYW4pO1xuICBsZXQgc2Nyb2xsVG9wID0gMDtcbiAgaWYgKGVsZW1lbnQuc2Nyb2xsVG9wID4gMCkge1xuICAgIHNjcm9sbFRvcCA9IGVsZW1lbnQuc2Nyb2xsVG9wO1xuICB9XG5cbiAgY29vcmRzID0ge1xuICAgIHRvcDogc3Bhbi5vZmZzZXRUb3AgKyBwYXJzZUludChjb21wdXRlZFsnYm9yZGVyVG9wV2lkdGgnXSwgMTApIC0gc2Nyb2xsVG9wLFxuICAgIGxlZnQ6IHNwYW4ub2Zmc2V0TGVmdCArIHBhcnNlSW50KGNvbXB1dGVkWydib3JkZXJMZWZ0V2lkdGgnXSwgMTApXG4gIH07XG5cbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuXG4gIHJldHVybiBjb29yZHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50U3R5bGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIHByb3BlcnR5Pzogc3RyaW5nKTogYW55IHtcbiAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA/IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkgOiAoPGFueT5lbGVtZW50KS5jdXJyZW50U3R5bGU7XG4gIGlmIChwcm9wZXJ0eSAmJiB0eXBlb2YgcHJvcGVydHkgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBzdHlsZVtwcm9wZXJ0eV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHN0eWxlW3Byb3BlcnR5XTtcbiAgfSBlbHNlIGlmIChwcm9wZXJ0eSAmJiB0eXBlb2YgcHJvcGVydHkgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc3R5bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDYXJldFBvc2l0aW9uKGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQsIHBvc2l0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgaWYgKGlzSW5wdXRPclRleHRBcmVhRWxlbWVudChlbGVtZW50KSAmJiBlbGVtZW50LnNlbGVjdGlvblN0YXJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgZWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShwb3NpdGlvbiwgcG9zaXRpb24pO1xuICAgIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPSBwb3NpdGlvbjtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgcmFuZ2Uuc2V0U3RhcnQoZWxlbWVudCwgcG9zaXRpb24pO1xuICAgIHJhbmdlLmNvbGxhcHNlKHRydWUpO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgc2VsZWN0aW9uLmFkZFJhbmdlKHJhbmdlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYXJrdXBNZW50aW9uIHtcbiAgbWFya3VwOiBzdHJpbmc7XG4gIHJlZ0V4OiBSZWdFeHA7XG4gIGdyb3Vwczoge1trZXk6IHN0cmluZ106IG51bWJlcn07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrdXBUb1JlZ0V4cChtYXJrdXA6IHN0cmluZyk6IE1hcmt1cE1lbnRpb24ge1xuICBjb25zdCBwbGFjZWhvbGRlclJlZ0V4cCA9IC9fXyhbXFx3XSspX18vZztcbiAgY29uc3QgcGxhY2Vob2xkZXJFeGNsdXNpb24gPSAnXlxcXFwpXFxcXF0nO1xuICBsZXQgbWFya3VwUGF0dGVybiA9IGVzY2FwZVJlZ0V4cChtYXJrdXApO1xuICBjb25zdCBwbGFjZWhvbGRlcnMgPSB7fTtcbiAgbGV0IG1hdGNoOyBsZXQgaSA9IDE7XG4gIGRvIHtcbiAgICBtYXRjaCA9IHBsYWNlaG9sZGVyUmVnRXhwLmV4ZWMobWFya3VwUGF0dGVybik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IG1hdGNoWzFdO1xuICAgICAgbWFya3VwUGF0dGVybiA9IG1hcmt1cFBhdHRlcm4ucmVwbGFjZShgX18ke3BsYWNlaG9sZGVyfV9fYCwgYChbJHtwbGFjZWhvbGRlckV4Y2x1c2lvbn1dKylgKTtcbiAgICAgIHBsYWNlaG9sZGVyc1twbGFjZWhvbGRlcl0gPSArK2k7XG4gICAgfVxuICB9IHdoaWxlIChtYXRjaCk7XG5cbiAgcmV0dXJuIHttYXJrdXAsIHJlZ0V4OiBuZXcgUmVnRXhwKCcoJyArIG1hcmt1cFBhdHRlcm4gKyAnKScsICdpZycpLCBncm91cHM6IHBsYWNlaG9sZGVyc307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGFpblRleHQoXG4gICAgdmFsdWU6IHN0cmluZywgbWVudGlvbk1hcmt1cDogTWFya3VwTWVudGlvbiwgZGlzcGxheVRyYW5zZm9ybTogKC4uLl86IHN0cmluZ1tdKSA9PiBzdHJpbmcpIHtcbiAgbWVudGlvbk1hcmt1cC5yZWdFeC5sYXN0SW5kZXggPSAwO1xuICByZXR1cm4gdmFsdWUucmVwbGFjZShtZW50aW9uTWFya3VwLnJlZ0V4LCBkaXNwbGF5VHJhbnNmb3JtKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VQbGFjZWhvbGRlcnMoaXRlbTogYW55LCBtYXJrdXBNZW50aW9uOiBNYXJrdXBNZW50aW9uKTogc3RyaW5nIHtcbiAgbGV0IHJlc3VsdCA9IG1hcmt1cE1lbnRpb24ubWFya3VwICsgJyc7XG4gIE9iamVjdC5rZXlzKG1hcmt1cE1lbnRpb24uZ3JvdXBzKVxuICAgICAgLmZvckVhY2goXG4gICAgICAgICAga2V5ID0+IHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKG5ldyBSZWdFeHAoYF9fJHtrZXl9X19gLCAnZycpLCB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgPyBpdGVtIDogaXRlbVtrZXldKSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q2hhbmdlVG9WYWx1ZShcbiAgICB2YWx1ZTogc3RyaW5nLCBtYXJrdXBNZW50aW9uOiBNYXJrdXBNZW50aW9uLCBwbGFpblRleHRWYWx1ZTogc3RyaW5nLCBzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZTogbnVtYmVyID0gMCxcbiAgICBzZWxlY3Rpb25FbmRCZWZvcmVDaGFuZ2U6IG51bWJlciA9IDAsIHNlbGVjdGlvbkVuZEFmdGVyQ2hhbmdlOiBudW1iZXIgPSAwLFxuICAgIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nKSB7XG4gIGNvbnN0IG9sZFBsYWluVGV4dFZhbHVlID0gZ2V0UGxhaW5UZXh0KHZhbHVlLCBtYXJrdXBNZW50aW9uLCBkaXNwbGF5VHJhbnNmb3JtKTtcbiAgY29uc3QgbGVuZ3RoRGVsdGEgPSBvbGRQbGFpblRleHRWYWx1ZS5sZW5ndGggLSBwbGFpblRleHRWYWx1ZS5sZW5ndGg7XG5cbiAgLyoqIGZpeCBpc3N1ZSB3aGVuIGZpcnN0IGNoYXJhY3RlciBjaGFuZ2luZyAqKi9cbi8qICBpZiAoIXNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlKSB7XG4gICAgc2VsZWN0aW9uU3RhcnRCZWZvcmVDaGFuZ2UgPSBzZWxlY3Rpb25FbmRCZWZvcmVDaGFuZ2UgKyBsZW5ndGhEZWx0YTtcbiAgfVxuICBpZiAoIXNlbGVjdGlvbkVuZEJlZm9yZUNoYW5nZSkge1xuICAgIHNlbGVjdGlvbkVuZEJlZm9yZUNoYW5nZSA9IHNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlO1xuICB9Ki9cblxuICBpZiAoc2VsZWN0aW9uU3RhcnRCZWZvcmVDaGFuZ2UgPT09IHNlbGVjdGlvbkVuZEJlZm9yZUNoYW5nZSAmJiBzZWxlY3Rpb25FbmRCZWZvcmVDaGFuZ2UgPT09IHNlbGVjdGlvbkVuZEFmdGVyQ2hhbmdlICYmXG4gICAgICBvbGRQbGFpblRleHRWYWx1ZS5sZW5ndGggPT09IHBsYWluVGV4dFZhbHVlLmxlbmd0aCkge1xuICAgIHNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlLS07XG4gIH1cblxuICBjb25zdCBpbnNlcnQgPSBwbGFpblRleHRWYWx1ZS5zbGljZShzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZSwgc2VsZWN0aW9uRW5kQWZ0ZXJDaGFuZ2UpO1xuICBjb25zdCBzcGxpY2VTdGFydCA9IE1hdGgubWluKHNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlLCBzZWxlY3Rpb25FbmRBZnRlckNoYW5nZSk7XG4gIGxldCBzcGxpY2VFbmQgPSBzZWxlY3Rpb25FbmRCZWZvcmVDaGFuZ2U7XG4gIGlmIChzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZSA9PT0gc2VsZWN0aW9uRW5kQWZ0ZXJDaGFuZ2UpIHtcbiAgICBzcGxpY2VFbmQgPSBNYXRoLm1heChzZWxlY3Rpb25FbmRCZWZvcmVDaGFuZ2UsIHNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlICsgbGVuZ3RoRGVsdGEpO1xuICB9XG5cbiAgcmV0dXJuIHNwbGljZVN0cmluZyhcbiAgICAgIHZhbHVlLCBtYXBQbGFpblRleHRJbmRleCh2YWx1ZSwgbWFya3VwTWVudGlvbiwgc3BsaWNlU3RhcnQsIGZhbHNlLCBkaXNwbGF5VHJhbnNmb3JtKSxcbiAgICAgIG1hcFBsYWluVGV4dEluZGV4KHZhbHVlLCBtYXJrdXBNZW50aW9uLCBzcGxpY2VFbmQsIHRydWUsIGRpc3BsYXlUcmFuc2Zvcm0pLCBpbnNlcnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFN0YXJ0T2ZNZW50aW9uSW5QbGFpblRleHQoXG4gICAgdmFsdWU6IHN0cmluZywgbWVudGlvbk1hcmt1cDogTWFya3VwTWVudGlvbiwgaW5kZXhJblBsYWluVGV4dDogbnVtYmVyLFxuICAgIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nKToge3N0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyfSB7XG4gIGxldCByZXN1bHQgPSB7c3RhcnQ6IC0xLCBlbmQ6IC0xfTtcbiAgY29uc3QgbWFya3VwSXRlcmF0b3IgPVxuICAgICAgKG1hdGNoU3RyaW5nOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIG1lbnRpb25QbGFpblRleHRJbmRleDogbnVtYmVyLCBkaXNwbGF5OiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgICAgICAgaWYgKG1lbnRpb25QbGFpblRleHRJbmRleCA8IGluZGV4SW5QbGFpblRleHQgJiYgbWVudGlvblBsYWluVGV4dEluZGV4ICsgZGlzcGxheS5sZW5ndGggPiBpbmRleEluUGxhaW5UZXh0KSB7XG4gICAgICAgICAgcmVzdWx0ID0ge3N0YXJ0OiBtZW50aW9uUGxhaW5UZXh0SW5kZXgsIGVuZDogbWVudGlvblBsYWluVGV4dEluZGV4ICsgZGlzcGxheS5sZW5ndGh9O1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcbiAgaXRlcmF0ZU9ubHlNZW50aW9uc01hcmt1cCh2YWx1ZSwgbWVudGlvbk1hcmt1cCwgbWFya3VwSXRlcmF0b3IsIGRpc3BsYXlUcmFuc2Zvcm0pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZHNPZk1lbnRpb25BdFBvc2l0aW9uKFxuICAgIHZhbHVlOiBzdHJpbmcsIG1lbnRpb25NYXJrdXA6IE1hcmt1cE1lbnRpb24sIGluZGV4SW5QbGFpblRleHQ6IG51bWJlcixcbiAgICBkaXNwbGF5VHJhbnNmb3JtOiAoLi4uXzogc3RyaW5nW10pID0+IHN0cmluZyk6IHtzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcn0ge1xuICByZXR1cm4gZmluZFN0YXJ0T2ZNZW50aW9uSW5QbGFpblRleHQodmFsdWUsIG1lbnRpb25NYXJrdXAsIGluZGV4SW5QbGFpblRleHQsIGRpc3BsYXlUcmFuc2Zvcm0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSHRtbCh0ZXh0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIHRleHQucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29vcmRpbmF0ZVdpdGhpblJlY3QocmVjdDogQ2xpZW50UmVjdCwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgcmV0dXJuIChyZWN0LmxlZnQgPCB4ICYmIHggPCByZWN0LnJpZ2h0KSAmJiAocmVjdC50b3AgPCB5ICYmIHkgPCByZWN0LmJvdHRvbSk7XG59XG5cbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRlZCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBlbGVtZW50OiBFbGVtZW50LCBwdWJsaWMgcmVhZG9ubHkgdHlwZTogc3RyaW5nID0gbnVsbCkge31cblxuICBnZXQgY2xpZW50UmVjdCgpOiBDbGllbnRSZWN0IHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG59XG4iXX0=