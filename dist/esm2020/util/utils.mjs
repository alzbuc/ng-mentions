export const styleProperties = Object.freeze([
    'direction',
    'boxSizing',
    'width',
    'height',
    'minHeight',
    'minWidth',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize',
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
    return (element !== null &&
        (element.nodeName.toUpperCase() === 'INPUT' ||
            element.nodeName.toUpperCase() === 'TEXTAREA' ||
            element.nodeName === '#text'));
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
    styleProperties.forEach((prop) => (style[prop] = computed[prop]));
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
        left: span.offsetLeft + parseInt(computed['borderLeftWidth'], 10),
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
    Object.keys(markupMention.groups).forEach((key) => (result = result.replace(new RegExp(`__${key}__`, 'g'), typeof item === 'string' ? item : item[key])));
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
    if (selectionStartBeforeChange === selectionEndBeforeChange &&
        selectionEndBeforeChange === selectionEndAfterChange &&
        oldPlainTextValue.length === plainTextValue.length) {
        selectionStartBeforeChange--;
    }
    const insert = plainTextValue.slice(selectionStartBeforeChange, selectionEndAfterChange);
    const spliceStart = Math.min(selectionStartBeforeChange, selectionEndAfterChange);
    let spliceEnd = selectionEndBeforeChange;
    if (selectionStartBeforeChange === selectionEndAfterChange) {
        spliceEnd = Math.max(selectionEndBeforeChange, selectionStartBeforeChange + lengthDelta);
    }
    console.log(insert);
    console.log(spliceStart);
    console.log(spliceEnd);
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
    return rect.left < x && x < rect.right && rect.top < y && y < rect.bottom;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQyxXQUFXO0lBQ1gsV0FBVztJQUNYLE9BQU87SUFDUCxRQUFRO0lBQ1IsV0FBVztJQUNYLFVBQVU7SUFDVixXQUFXO0lBQ1gsV0FBVztJQUVYLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLGlCQUFpQjtJQUNqQixhQUFhO0lBRWIsWUFBWTtJQUNaLGNBQWM7SUFDZCxlQUFlO0lBQ2YsYUFBYTtJQUViLHdEQUF3RDtJQUN4RCxXQUFXO0lBQ1gsYUFBYTtJQUNiLFlBQVk7SUFDWixhQUFhO0lBQ2IsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osWUFBWTtJQUVaLFdBQVc7SUFDWCxlQUFlO0lBQ2YsWUFBWTtJQUNaLGdCQUFnQjtJQUVoQixlQUFlO0lBQ2YsYUFBYTtJQUViLFNBQVM7SUFDVCxZQUFZO0NBQ2IsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDO0FBQ2hELE1BQU0sU0FBUyxHQUFHLFNBQVMsSUFBVSxNQUFPLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQztBQUVyRSxtQ0FBbUM7QUFDbkMsTUFBTSxXQUFXLEdBQ2YscVZBQXFWLENBQUM7QUFDeFYsbUNBQW1DO0FBQ25DLE1BQU0sWUFBWSxHQUNoQix5a0RBQXlrRCxDQUFDO0FBQzVrRCxNQUFNLFVBQVUsZ0JBQWdCO0lBQzlCLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSyxNQUFjLENBQUMsS0FBSyxDQUFDO0lBQy9FLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVELFNBQVMsd0JBQXdCLENBQUMsT0FBcUI7SUFDckQsT0FBTyxDQUNMLE9BQU8sS0FBSyxJQUFJO1FBQ2hCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPO1lBQ3pDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssVUFBVTtZQUM3QyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUNoQyxDQUFDO0FBQ0osQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsR0FBVyxFQUFFLE1BQWM7SUFDN0UsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDeEUsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQzVCLEtBQWEsRUFDYixhQUE0QixFQUM1QixZQUFtQyxFQUNuQyxjQUFxQyxFQUNyQyxnQkFBNEM7SUFFNUMsSUFBSSxLQUFLLENBQUM7SUFDVixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQztJQUM5QixNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ2xDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUMzQyxNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRCxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ25ELHFCQUFxQixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdkMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RFLHFCQUFxQixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDeEMsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7S0FDekI7SUFFRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ3hCLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3BFO0FBQ0gsQ0FBQztBQUVELFNBQVMseUJBQXlCLENBQ2hDLEtBQWEsRUFDYixhQUE0QixFQUM1QixjQUF3QyxFQUN4QyxnQkFBNEM7SUFFNUMsSUFBSSxLQUFLLENBQUM7SUFDVixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLHFCQUFxQixHQUFHLENBQUMsQ0FBQztJQUM5QixNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ2xDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUMzQyxNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRCxxQkFBcUIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RSxxQkFBcUIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3hDLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO0tBQ3pCO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FDL0IsS0FBYSxFQUNiLGFBQTRCLEVBQzVCLGdCQUF3QixFQUN4QixhQUFzQixFQUN0QixnQkFBNEM7SUFFNUMsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtRQUMzQixPQUFPLGdCQUFnQixDQUFDO0tBQ3pCO0lBRUQsSUFBSSxNQUFNLENBQUM7SUFDWCxNQUFNLFlBQVksR0FBRyxDQUFDLFdBQW1CLEVBQUUsS0FBYSxFQUFFLHVCQUErQixFQUFFLEVBQUU7UUFDM0YsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDakMsT0FBTztTQUNSO1FBQ0QsSUFBSSx1QkFBdUIsR0FBRyxXQUFXLENBQUMsTUFBTSxJQUFJLGdCQUFnQixFQUFFO1lBQ3BFLE1BQU0sR0FBRyxLQUFLLEdBQUcsZ0JBQWdCLEdBQUcsdUJBQXVCLENBQUM7U0FDN0Q7SUFDSCxDQUFDLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBRyxDQUFDLFdBQW1CLEVBQUUsS0FBYSxFQUFFLHFCQUE2QixFQUFFLE9BQWUsRUFBRSxFQUFFO1FBQzVHLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ2pDLE9BQU87U0FDUjtRQUVELElBQUkscUJBQXFCLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsRUFBRTtZQUM3RCxNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzRDtJQUNILENBQUMsQ0FBQztJQUVGLHFCQUFxQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBRTVGLE9BQU8sT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDL0QsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxPQUF5QjtJQUN4RCxJQUFJLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDNUIsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyRjtJQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1FBQzVCLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDO0tBQzFCO0lBRUQsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE9BQTRCLEVBQUUsUUFBZ0I7SUFDaEYsSUFBSSxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNqQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUNELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN4QixNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDOUIsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtRQUNoQyxLQUFLLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztLQUMvQjtJQUNELEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQzVCLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0lBQzVCLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsSUFBSSxTQUFTLEVBQUU7UUFDYixJQUFJLE9BQU8sQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDeEQsS0FBSyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7U0FDNUI7S0FDRjtTQUFNO1FBQ0wsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7S0FDM0I7SUFDRCxHQUFHLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN2RCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO1FBQ2hDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzVEO0lBRUQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUM1RCxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNsQixJQUFJLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ3pCLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0tBQy9CO0lBRUQsTUFBTSxHQUFHO1FBQ1AsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLFNBQVM7UUFDMUUsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsQ0FBQztLQUNsRSxDQUFDO0lBRUYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFL0IsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBb0IsRUFBRSxRQUFpQjtJQUNyRSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBTyxPQUFRLENBQUMsWUFBWSxDQUFDO0lBQ2hHLElBQUksUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxXQUFXLEVBQUU7UUFDdEYsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDeEI7U0FBTSxJQUFJLFFBQVEsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDbkQsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxPQUF5QixFQUFFLFFBQWdCO0lBQzFFLElBQUksd0JBQXdCLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7UUFDN0UsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7S0FDbkM7U0FBTTtRQUNMLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDNUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQjtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUFDLEdBQVc7SUFDdEMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFRRCxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQWM7SUFDM0MsTUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQUM7SUFDekMsTUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUM7SUFDdkMsSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN4QixJQUFJLEtBQUssQ0FBQztJQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLEdBQUc7UUFDRCxLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlDLElBQUksS0FBSyxFQUFFO1lBQ1QsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLGFBQWEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssV0FBVyxJQUFJLEVBQUUsS0FBSyxvQkFBb0IsS0FBSyxDQUFDLENBQUM7WUFDNUYsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2pDO0tBQ0YsUUFBUSxLQUFLLEVBQUU7SUFFaEIsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUMsR0FBRyxHQUFHLGFBQWEsR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDO0FBQzlGLENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixLQUFhLEVBQ2IsYUFBNEIsRUFDNUIsZ0JBQTRDO0lBRTVDLGFBQWEsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNsQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBUyxFQUFFLGFBQTRCO0lBQ3pFLElBQUksTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FDdkMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FDL0csQ0FBQztJQUVGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLFVBQVUsa0JBQWtCLENBQ2hDLEtBQWEsRUFDYixhQUE0QixFQUM1QixjQUFzQixFQUN0Qiw2QkFBcUMsQ0FBQyxFQUN0QywyQkFBbUMsQ0FBQyxFQUNwQywwQkFBa0MsQ0FBQyxFQUNuQyxnQkFBNEM7SUFFNUMsTUFBTSxpQkFBaUIsR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQy9FLE1BQU0sV0FBVyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBRXJFLCtDQUErQztJQUNqRDs7Ozs7U0FLSztJQUVILElBQ0UsMEJBQTBCLEtBQUssd0JBQXdCO1FBQ3ZELHdCQUF3QixLQUFLLHVCQUF1QjtRQUNwRCxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssY0FBYyxDQUFDLE1BQU0sRUFDbEQ7UUFDQSwwQkFBMEIsRUFBRSxDQUFDO0tBQzlCO0lBRUQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3pGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUNsRixJQUFJLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztJQUN6QyxJQUFJLDBCQUEwQixLQUFLLHVCQUF1QixFQUFFO1FBQzFELFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLDBCQUEwQixHQUFHLFdBQVcsQ0FBQyxDQUFDO0tBQzFGO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkIsT0FBTyxZQUFZLENBQ2pCLEtBQUssRUFDTCxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsRUFDN0UsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixDQUFDLEVBQzFFLE1BQU0sQ0FDUCxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sVUFBVSw2QkFBNkIsQ0FDM0MsS0FBYSxFQUNiLGFBQTRCLEVBQzVCLGdCQUF3QixFQUN4QixnQkFBNEM7SUFFNUMsSUFBSSxNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDcEMsTUFBTSxjQUFjLEdBQUcsQ0FDckIsV0FBbUIsRUFDbkIsS0FBYSxFQUNiLHFCQUE2QixFQUM3QixPQUFlLEVBQ04sRUFBRTtRQUNYLElBQUkscUJBQXFCLEdBQUcsZ0JBQWdCLElBQUkscUJBQXFCLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsRUFBRTtZQUN6RyxNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxFQUFFLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN2RixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUM7SUFDRix5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBRWxGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFNLFVBQVUsNEJBQTRCLENBQzFDLEtBQWEsRUFDYixhQUE0QixFQUM1QixnQkFBd0IsRUFDeEIsZ0JBQTRDO0lBRTVDLE9BQU8sNkJBQTZCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pHLENBQUM7QUFFRCxNQUFNLFVBQVUsVUFBVSxDQUFDLElBQVk7SUFDckMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFFRCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsSUFBYSxFQUFFLENBQVMsRUFBRSxDQUFTO0lBQ3hFLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDNUUsQ0FBQztBQUVELE1BQU0sT0FBTyxXQUFXO0lBQ3RCLFlBQTRCLE9BQWdCLEVBQWtCLE9BQWUsSUFBSTtRQUFyRCxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQWtCLFNBQUksR0FBSixJQUFJLENBQWU7SUFBRyxDQUFDO0lBRXJGLElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzlDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzdHlsZVByb3BlcnRpZXMgPSBPYmplY3QuZnJlZXplKFtcbiAgJ2RpcmVjdGlvbicsIC8vIFJUTCBzdXBwb3J0XG4gICdib3hTaXppbmcnLFxuICAnd2lkdGgnLCAvLyBvbiBDaHJvbWUgYW5kIElFLCBleGNsdWRlIHRoZSBzY3JvbGxiYXIsIHNvIHRoZSBtaXJyb3IgZGl2IHdyYXBzIGV4YWN0bHkgYXMgdGhlIHRleHRhcmVhIGRvZXNcbiAgJ2hlaWdodCcsXG4gICdtaW5IZWlnaHQnLFxuICAnbWluV2lkdGgnLFxuICAnb3ZlcmZsb3dYJyxcbiAgJ292ZXJmbG93WScsIC8vIGNvcHkgdGhlIHNjcm9sbGJhciBmb3IgSUVcblxuICAnYm9yZGVyVG9wV2lkdGgnLFxuICAnYm9yZGVyUmlnaHRXaWR0aCcsXG4gICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdib3JkZXJMZWZ0V2lkdGgnLFxuICAnYm9yZGVyU3R5bGUnLFxuXG4gICdwYWRkaW5nVG9wJyxcbiAgJ3BhZGRpbmdSaWdodCcsXG4gICdwYWRkaW5nQm90dG9tJyxcbiAgJ3BhZGRpbmdMZWZ0JyxcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvZm9udFxuICAnZm9udFN0eWxlJyxcbiAgJ2ZvbnRWYXJpYW50JyxcbiAgJ2ZvbnRXZWlnaHQnLFxuICAnZm9udFN0cmV0Y2gnLFxuICAnZm9udFNpemUnLFxuICAnZm9udFNpemVBZGp1c3QnLFxuICAnbGluZUhlaWdodCcsXG4gICdmb250RmFtaWx5JyxcblxuICAndGV4dEFsaWduJyxcbiAgJ3RleHRUcmFuc2Zvcm0nLFxuICAndGV4dEluZGVudCcsXG4gICd0ZXh0RGVjb3JhdGlvbicsIC8vIG1pZ2h0IG5vdCBtYWtlIGEgZGlmZmVyZW5jZSwgYnV0IGJldHRlciBiZSBzYWZlXG5cbiAgJ2xldHRlclNwYWNpbmcnLFxuICAnd29yZFNwYWNpbmcnLFxuXG4gICd0YWJTaXplJyxcbiAgJ01velRhYlNpemUnLFxuXSk7XG5jb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbmNvbnN0IGlzRmlyZWZveCA9IGlzQnJvd3NlciAmJiAoPGFueT53aW5kb3cpLm1veklubmVyU2NyZWVuWCAhPSBudWxsO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuY29uc3QgbW9iaWxlUmVnRXggPVxuICAvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vfGFuZHJvaWR8aXBhZHxwbGF5Ym9va3xzaWxrL2k7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuY29uc3QgbW9iaWxlUmVnRXgyID1cbiAgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2k7XG5leHBvcnQgZnVuY3Rpb24gaXNNb2JpbGVPclRhYmxldCgpIHtcbiAgY29uc3QgYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50IHx8IG5hdmlnYXRvci52ZW5kb3IgfHwgKHdpbmRvdyBhcyBhbnkpLm9wZXJhO1xuICByZXR1cm4gbW9iaWxlUmVnRXgudGVzdChhZ2VudCkgfHwgbW9iaWxlUmVnRXgyLnRlc3QoYWdlbnQuc3Vic3RyKDAsIDQpKTtcbn1cblxuZnVuY3Rpb24gaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsZW1lbnQ/OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGVsZW1lbnQgIT09IG51bGwgJiZcbiAgICAoZWxlbWVudC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnSU5QVVQnIHx8XG4gICAgICBlbGVtZW50Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdURVhUQVJFQScgfHxcbiAgICAgIGVsZW1lbnQubm9kZU5hbWUgPT09ICcjdGV4dCcpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNwbGljZVN0cmluZyh2YWx1ZTogc3RyaW5nLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgaW5zZXJ0OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIGluc2VydCArIHZhbHVlLnN1YnN0cmluZyhlbmQpICsgJyc7XG59XG5cbmZ1bmN0aW9uIGl0ZXJhdGVNZW50aW9uc01hcmt1cChcbiAgdmFsdWU6IHN0cmluZyxcbiAgbWVudGlvbk1hcmt1cDogTWFya3VwTWVudGlvbixcbiAgdGV4dEl0ZXJhdG9yOiAoLi4uXzogYW55W10pID0+IHZvaWQsXG4gIG1hcmt1cEl0ZXJhdG9yOiAoLi4uXzogYW55W10pID0+IHZvaWQsXG4gIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nLFxuKSB7XG4gIGxldCBtYXRjaDtcbiAgbGV0IHN0YXJ0ID0gMDtcbiAgbGV0IGN1cnJlbnRQbGFpblRleHRJbmRleCA9IDA7XG4gIGNvbnN0IHJlZ0V4ID0gbWVudGlvbk1hcmt1cC5yZWdFeDtcbiAgcmVnRXgubGFzdEluZGV4ID0gMDtcbiAgd2hpbGUgKChtYXRjaCA9IHJlZ0V4LmV4ZWModmFsdWUpKSAhPT0gbnVsbCkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBkaXNwbGF5VHJhbnNmb3JtKC4uLm1hdGNoKTtcbiAgICBjb25zdCBzdWJzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoc3RhcnQsIG1hdGNoLmluZGV4KTtcbiAgICB0ZXh0SXRlcmF0b3Ioc3Vic3RyLCBzdGFydCwgY3VycmVudFBsYWluVGV4dEluZGV4KTtcbiAgICBjdXJyZW50UGxhaW5UZXh0SW5kZXggKz0gc3Vic3RyLmxlbmd0aDtcbiAgICBtYXJrdXBJdGVyYXRvcihtYXRjaFswXSwgbWF0Y2guaW5kZXgsIGN1cnJlbnRQbGFpblRleHRJbmRleCwgZGlzcGxheSk7XG4gICAgY3VycmVudFBsYWluVGV4dEluZGV4ICs9IGRpc3BsYXkubGVuZ3RoO1xuICAgIHN0YXJ0ID0gcmVnRXgubGFzdEluZGV4O1xuICB9XG5cbiAgaWYgKHN0YXJ0IDwgdmFsdWUubGVuZ3RoKSB7XG4gICAgdGV4dEl0ZXJhdG9yKHZhbHVlLnN1YnN0cmluZyhzdGFydCksIHN0YXJ0LCBjdXJyZW50UGxhaW5UZXh0SW5kZXgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGl0ZXJhdGVPbmx5TWVudGlvbnNNYXJrdXAoXG4gIHZhbHVlOiBzdHJpbmcsXG4gIG1lbnRpb25NYXJrdXA6IE1hcmt1cE1lbnRpb24sXG4gIG1hcmt1cEl0ZXJhdG9yOiAoLi4uXzogYW55W10pID0+IGJvb2xlYW4sXG4gIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nLFxuKSB7XG4gIGxldCBtYXRjaDtcbiAgbGV0IHN0YXJ0ID0gMDtcbiAgbGV0IGN1cnJlbnRQbGFpblRleHRJbmRleCA9IDA7XG4gIGNvbnN0IHJlZ0V4ID0gbWVudGlvbk1hcmt1cC5yZWdFeDtcbiAgcmVnRXgubGFzdEluZGV4ID0gMDtcbiAgd2hpbGUgKChtYXRjaCA9IHJlZ0V4LmV4ZWModmFsdWUpKSAhPT0gbnVsbCkge1xuICAgIGNvbnN0IGRpc3BsYXkgPSBkaXNwbGF5VHJhbnNmb3JtKC4uLm1hdGNoKTtcbiAgICBjb25zdCBzdWJzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoc3RhcnQsIG1hdGNoLmluZGV4KTtcbiAgICBjdXJyZW50UGxhaW5UZXh0SW5kZXggKz0gc3Vic3RyLmxlbmd0aDtcbiAgICBtYXJrdXBJdGVyYXRvcihtYXRjaFswXSwgbWF0Y2guaW5kZXgsIGN1cnJlbnRQbGFpblRleHRJbmRleCwgZGlzcGxheSk7XG4gICAgY3VycmVudFBsYWluVGV4dEluZGV4ICs9IGRpc3BsYXkubGVuZ3RoO1xuICAgIHN0YXJ0ID0gcmVnRXgubGFzdEluZGV4O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBQbGFpblRleHRJbmRleChcbiAgdmFsdWU6IHN0cmluZyxcbiAgbWVudGlvbk1hcmt1cDogTWFya3VwTWVudGlvbixcbiAgaW5kZXhJblBsYWluVGV4dDogbnVtYmVyLFxuICB0b0VuZE9mTWFya3VwOiBib29sZWFuLFxuICBkaXNwbGF5VHJhbnNmb3JtOiAoLi4uXzogc3RyaW5nW10pID0+IHN0cmluZyxcbik6IG51bWJlciB7XG4gIGlmIChpc05hTihpbmRleEluUGxhaW5UZXh0KSkge1xuICAgIHJldHVybiBpbmRleEluUGxhaW5UZXh0O1xuICB9XG5cbiAgbGV0IHJlc3VsdDtcbiAgY29uc3QgdGV4dEl0ZXJhdG9yID0gKG1hdGNoU3RyaW5nOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHN1YnN0cmluZ1BsYWluVGV4dEluZGV4OiBudW1iZXIpID0+IHtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN1YnN0cmluZ1BsYWluVGV4dEluZGV4ICsgbWF0Y2hTdHJpbmcubGVuZ3RoID49IGluZGV4SW5QbGFpblRleHQpIHtcbiAgICAgIHJlc3VsdCA9IGluZGV4ICsgaW5kZXhJblBsYWluVGV4dCAtIHN1YnN0cmluZ1BsYWluVGV4dEluZGV4O1xuICAgIH1cbiAgfTtcbiAgY29uc3QgbWFya3VwSXRlcmF0b3IgPSAobWF0Y2hTdHJpbmc6IHN0cmluZywgaW5kZXg6IG51bWJlciwgbWVudGlvblBsYWluVGV4dEluZGV4OiBudW1iZXIsIGRpc3BsYXk6IHN0cmluZykgPT4ge1xuICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChtZW50aW9uUGxhaW5UZXh0SW5kZXggKyBkaXNwbGF5Lmxlbmd0aCA+IGluZGV4SW5QbGFpblRleHQpIHtcbiAgICAgIHJlc3VsdCA9IGluZGV4ICsgKHRvRW5kT2ZNYXJrdXAgPyBtYXRjaFN0cmluZy5sZW5ndGggOiAwKTtcbiAgICB9XG4gIH07XG5cbiAgaXRlcmF0ZU1lbnRpb25zTWFya3VwKHZhbHVlLCBtZW50aW9uTWFya3VwLCB0ZXh0SXRlcmF0b3IsIG1hcmt1cEl0ZXJhdG9yLCBkaXNwbGF5VHJhbnNmb3JtKTtcblxuICByZXR1cm4gdHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcgPyByZXN1bHQgOiB2YWx1ZS5sZW5ndGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXJldFBvc2l0aW9uKGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQpOiBudW1iZXIge1xuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgY29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgIHJldHVybiB2YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KS5sZW5ndGggLSAoaXNNb2JpbGVPclRhYmxldCgpID8gMSA6IDApO1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICBpZiAoc2VsZWN0aW9uLnJhbmdlQ291bnQgPiAwKSB7XG4gICAgY29uc3QgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKTtcbiAgICByZXR1cm4gcmFuZ2Uuc3RhcnRPZmZzZXQ7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhcmV0Q29vcmRpbmF0ZXMoZWxlbWVudDogSFRNTFRleHRBcmVhRWxlbWVudCwgcG9zaXRpb246IG51bWJlcik6IHsgdG9wOiBudW1iZXI7IGxlZnQ6IG51bWJlciB9IHtcbiAgbGV0IGNvb3JkcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XG4gIGlmICghaXNCcm93c2VyKSB7XG4gICAgcmV0dXJuIGNvb3JkcztcbiAgfVxuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICBjb25zdCBzdHlsZSA9IGRpdi5zdHlsZTtcbiAgY29uc3QgY29tcHV0ZWQgPSBnZXRFbGVtZW50U3R5bGUoZWxlbWVudCk7XG4gIHN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnO1xuICBpZiAoZWxlbWVudC5ub2RlTmFtZSAhPT0gJ0lOUFVUJykge1xuICAgIHN0eWxlLndvcmRXcmFwID0gJ2JyZWFrLXdvcmQnO1xuICB9XG4gIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICBzdHlsZVByb3BlcnRpZXMuZm9yRWFjaCgocHJvcCkgPT4gKHN0eWxlW3Byb3BdID0gY29tcHV0ZWRbcHJvcF0pKTtcbiAgaWYgKGlzRmlyZWZveCkge1xuICAgIGlmIChlbGVtZW50LnNjcm9sbEhlaWdodCA+IHBhcnNlSW50KGNvbXB1dGVkLmhlaWdodCwgMTApKSB7XG4gICAgICBzdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgfVxuICBkaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnZhbHVlLnN1YnN0cmluZygwLCBwb3NpdGlvbik7XG4gIGlmIChlbGVtZW50Lm5vZGVOYW1lID09PSAnSU5QVVQnKSB7XG4gICAgZGl2LnRleHRDb250ZW50ID0gZGl2LnRleHRDb250ZW50LnJlcGxhY2UoL1xccy9nLCAnXFx1MDBhMCcpO1xuICB9XG5cbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgc3Bhbi50ZXh0Q29udGVudCA9IGVsZW1lbnQudmFsdWUuc3Vic3RyaW5nKHBvc2l0aW9uKSB8fCAnLic7XG4gIGRpdi5hcHBlbmRDaGlsZChzcGFuKTtcbiAgbGV0IHNjcm9sbFRvcCA9IDA7XG4gIGlmIChlbGVtZW50LnNjcm9sbFRvcCA+IDApIHtcbiAgICBzY3JvbGxUb3AgPSBlbGVtZW50LnNjcm9sbFRvcDtcbiAgfVxuXG4gIGNvb3JkcyA9IHtcbiAgICB0b3A6IHNwYW4ub2Zmc2V0VG9wICsgcGFyc2VJbnQoY29tcHV0ZWRbJ2JvcmRlclRvcFdpZHRoJ10sIDEwKSAtIHNjcm9sbFRvcCxcbiAgICBsZWZ0OiBzcGFuLm9mZnNldExlZnQgKyBwYXJzZUludChjb21wdXRlZFsnYm9yZGVyTGVmdFdpZHRoJ10sIDEwKSxcbiAgfTtcblxuICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRpdik7XG5cbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRTdHlsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgcHJvcGVydHk/OiBzdHJpbmcpOiBhbnkge1xuICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSA6ICg8YW55PmVsZW1lbnQpLmN1cnJlbnRTdHlsZTtcbiAgaWYgKHByb3BlcnR5ICYmIHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHN0eWxlW3Byb3BlcnR5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc3R5bGVbcHJvcGVydHldO1xuICB9IGVsc2UgaWYgKHByb3BlcnR5ICYmIHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzdHlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldENhcmV0UG9zaXRpb24oZWxlbWVudDogSFRNTElucHV0RWxlbWVudCwgcG9zaXRpb246IG51bWJlcik6IHZvaWQge1xuICBpZiAoaXNJbnB1dE9yVGV4dEFyZWFFbGVtZW50KGVsZW1lbnQpICYmIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICBlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHBvc2l0aW9uLCBwb3NpdGlvbik7XG4gICAgZWxlbWVudC5zZWxlY3Rpb25TdGFydCA9IHBvc2l0aW9uO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICByYW5nZS5zZXRTdGFydChlbGVtZW50LCBwb3NpdGlvbik7XG4gICAgcmFuZ2UuY29sbGFwc2UodHJ1ZSk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICBzZWxlY3Rpb24uYWRkUmFuZ2UocmFuZ2UpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmt1cE1lbnRpb24ge1xuICBtYXJrdXA6IHN0cmluZztcbiAgcmVnRXg6IFJlZ0V4cDtcbiAgZ3JvdXBzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFya3VwVG9SZWdFeHAobWFya3VwOiBzdHJpbmcpOiBNYXJrdXBNZW50aW9uIHtcbiAgY29uc3QgcGxhY2Vob2xkZXJSZWdFeHAgPSAvX18oW1xcd10rKV9fL2c7XG4gIGNvbnN0IHBsYWNlaG9sZGVyRXhjbHVzaW9uID0gJ15cXFxcKVxcXFxdJztcbiAgbGV0IG1hcmt1cFBhdHRlcm4gPSBlc2NhcGVSZWdFeHAobWFya3VwKTtcbiAgY29uc3QgcGxhY2Vob2xkZXJzID0ge307XG4gIGxldCBtYXRjaDtcbiAgbGV0IGkgPSAxO1xuICBkbyB7XG4gICAgbWF0Y2ggPSBwbGFjZWhvbGRlclJlZ0V4cC5leGVjKG1hcmt1cFBhdHRlcm4pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBtYXRjaFsxXTtcbiAgICAgIG1hcmt1cFBhdHRlcm4gPSBtYXJrdXBQYXR0ZXJuLnJlcGxhY2UoYF9fJHtwbGFjZWhvbGRlcn1fX2AsIGAoWyR7cGxhY2Vob2xkZXJFeGNsdXNpb259XSspYCk7XG4gICAgICBwbGFjZWhvbGRlcnNbcGxhY2Vob2xkZXJdID0gKytpO1xuICAgIH1cbiAgfSB3aGlsZSAobWF0Y2gpO1xuXG4gIHJldHVybiB7IG1hcmt1cCwgcmVnRXg6IG5ldyBSZWdFeHAoJygnICsgbWFya3VwUGF0dGVybiArICcpJywgJ2lnJyksIGdyb3VwczogcGxhY2Vob2xkZXJzIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGFpblRleHQoXG4gIHZhbHVlOiBzdHJpbmcsXG4gIG1lbnRpb25NYXJrdXA6IE1hcmt1cE1lbnRpb24sXG4gIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nLFxuKSB7XG4gIG1lbnRpb25NYXJrdXAucmVnRXgubGFzdEluZGV4ID0gMDtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UobWVudGlvbk1hcmt1cC5yZWdFeCwgZGlzcGxheVRyYW5zZm9ybSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlUGxhY2Vob2xkZXJzKGl0ZW06IGFueSwgbWFya3VwTWVudGlvbjogTWFya3VwTWVudGlvbik6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSBtYXJrdXBNZW50aW9uLm1hcmt1cCArICcnO1xuICBPYmplY3Qua2V5cyhtYXJrdXBNZW50aW9uLmdyb3VwcykuZm9yRWFjaChcbiAgICAoa2V5KSA9PiAocmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UobmV3IFJlZ0V4cChgX18ke2tleX1fX2AsICdnJyksIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyA/IGl0ZW0gOiBpdGVtW2tleV0pKSxcbiAgKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDaGFuZ2VUb1ZhbHVlKFxuICB2YWx1ZTogc3RyaW5nLFxuICBtYXJrdXBNZW50aW9uOiBNYXJrdXBNZW50aW9uLFxuICBwbGFpblRleHRWYWx1ZTogc3RyaW5nLFxuICBzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZTogbnVtYmVyID0gMCxcbiAgc2VsZWN0aW9uRW5kQmVmb3JlQ2hhbmdlOiBudW1iZXIgPSAwLFxuICBzZWxlY3Rpb25FbmRBZnRlckNoYW5nZTogbnVtYmVyID0gMCxcbiAgZGlzcGxheVRyYW5zZm9ybTogKC4uLl86IHN0cmluZ1tdKSA9PiBzdHJpbmcsXG4pIHtcbiAgY29uc3Qgb2xkUGxhaW5UZXh0VmFsdWUgPSBnZXRQbGFpblRleHQodmFsdWUsIG1hcmt1cE1lbnRpb24sIGRpc3BsYXlUcmFuc2Zvcm0pO1xuICBjb25zdCBsZW5ndGhEZWx0YSA9IG9sZFBsYWluVGV4dFZhbHVlLmxlbmd0aCAtIHBsYWluVGV4dFZhbHVlLmxlbmd0aDtcblxuICAvKiogZml4IGlzc3VlIHdoZW4gZmlyc3QgY2hhcmFjdGVyIGNoYW5naW5nICoqL1xuLyogIGlmICghc2VsZWN0aW9uU3RhcnRCZWZvcmVDaGFuZ2UpIHtcbiAgICBzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZSA9IHNlbGVjdGlvbkVuZEJlZm9yZUNoYW5nZSArIGxlbmd0aERlbHRhO1xuICB9XG4gIGlmICghc2VsZWN0aW9uRW5kQmVmb3JlQ2hhbmdlKSB7XG4gICAgc2VsZWN0aW9uRW5kQmVmb3JlQ2hhbmdlID0gc2VsZWN0aW9uU3RhcnRCZWZvcmVDaGFuZ2U7XG4gIH0qL1xuXG4gIGlmIChcbiAgICBzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZSA9PT0gc2VsZWN0aW9uRW5kQmVmb3JlQ2hhbmdlICYmXG4gICAgc2VsZWN0aW9uRW5kQmVmb3JlQ2hhbmdlID09PSBzZWxlY3Rpb25FbmRBZnRlckNoYW5nZSAmJlxuICAgIG9sZFBsYWluVGV4dFZhbHVlLmxlbmd0aCA9PT0gcGxhaW5UZXh0VmFsdWUubGVuZ3RoXG4gICkge1xuICAgIHNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlLS07XG4gIH1cblxuICBjb25zdCBpbnNlcnQgPSBwbGFpblRleHRWYWx1ZS5zbGljZShzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZSwgc2VsZWN0aW9uRW5kQWZ0ZXJDaGFuZ2UpO1xuICBjb25zdCBzcGxpY2VTdGFydCA9IE1hdGgubWluKHNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlLCBzZWxlY3Rpb25FbmRBZnRlckNoYW5nZSk7XG4gIGxldCBzcGxpY2VFbmQgPSBzZWxlY3Rpb25FbmRCZWZvcmVDaGFuZ2U7XG4gIGlmIChzZWxlY3Rpb25TdGFydEJlZm9yZUNoYW5nZSA9PT0gc2VsZWN0aW9uRW5kQWZ0ZXJDaGFuZ2UpIHtcbiAgICBzcGxpY2VFbmQgPSBNYXRoLm1heChzZWxlY3Rpb25FbmRCZWZvcmVDaGFuZ2UsIHNlbGVjdGlvblN0YXJ0QmVmb3JlQ2hhbmdlICsgbGVuZ3RoRGVsdGEpO1xuICB9XG5cbiAgY29uc29sZS5sb2coaW5zZXJ0KTtcbiAgY29uc29sZS5sb2coc3BsaWNlU3RhcnQpO1xuICBjb25zb2xlLmxvZyhzcGxpY2VFbmQpO1xuICByZXR1cm4gc3BsaWNlU3RyaW5nKFxuICAgIHZhbHVlLFxuICAgIG1hcFBsYWluVGV4dEluZGV4KHZhbHVlLCBtYXJrdXBNZW50aW9uLCBzcGxpY2VTdGFydCwgZmFsc2UsIGRpc3BsYXlUcmFuc2Zvcm0pLFxuICAgIG1hcFBsYWluVGV4dEluZGV4KHZhbHVlLCBtYXJrdXBNZW50aW9uLCBzcGxpY2VFbmQsIHRydWUsIGRpc3BsYXlUcmFuc2Zvcm0pLFxuICAgIGluc2VydCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRTdGFydE9mTWVudGlvbkluUGxhaW5UZXh0KFxuICB2YWx1ZTogc3RyaW5nLFxuICBtZW50aW9uTWFya3VwOiBNYXJrdXBNZW50aW9uLFxuICBpbmRleEluUGxhaW5UZXh0OiBudW1iZXIsXG4gIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nLFxuKTogeyBzdGFydDogbnVtYmVyOyBlbmQ6IG51bWJlciB9IHtcbiAgbGV0IHJlc3VsdCA9IHsgc3RhcnQ6IC0xLCBlbmQ6IC0xIH07XG4gIGNvbnN0IG1hcmt1cEl0ZXJhdG9yID0gKFxuICAgIG1hdGNoU3RyaW5nOiBzdHJpbmcsXG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBtZW50aW9uUGxhaW5UZXh0SW5kZXg6IG51bWJlcixcbiAgICBkaXNwbGF5OiBzdHJpbmcsXG4gICk6IGJvb2xlYW4gPT4ge1xuICAgIGlmIChtZW50aW9uUGxhaW5UZXh0SW5kZXggPCBpbmRleEluUGxhaW5UZXh0ICYmIG1lbnRpb25QbGFpblRleHRJbmRleCArIGRpc3BsYXkubGVuZ3RoID4gaW5kZXhJblBsYWluVGV4dCkge1xuICAgICAgcmVzdWx0ID0geyBzdGFydDogbWVudGlvblBsYWluVGV4dEluZGV4LCBlbmQ6IG1lbnRpb25QbGFpblRleHRJbmRleCArIGRpc3BsYXkubGVuZ3RoIH07XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGl0ZXJhdGVPbmx5TWVudGlvbnNNYXJrdXAodmFsdWUsIG1lbnRpb25NYXJrdXAsIG1hcmt1cEl0ZXJhdG9yLCBkaXNwbGF5VHJhbnNmb3JtKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm91bmRzT2ZNZW50aW9uQXRQb3NpdGlvbihcbiAgdmFsdWU6IHN0cmluZyxcbiAgbWVudGlvbk1hcmt1cDogTWFya3VwTWVudGlvbixcbiAgaW5kZXhJblBsYWluVGV4dDogbnVtYmVyLFxuICBkaXNwbGF5VHJhbnNmb3JtOiAoLi4uXzogc3RyaW5nW10pID0+IHN0cmluZyxcbik6IHsgc3RhcnQ6IG51bWJlcjsgZW5kOiBudW1iZXIgfSB7XG4gIHJldHVybiBmaW5kU3RhcnRPZk1lbnRpb25JblBsYWluVGV4dCh2YWx1ZSwgbWVudGlvbk1hcmt1cCwgaW5kZXhJblBsYWluVGV4dCwgZGlzcGxheVRyYW5zZm9ybSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVIdG1sKHRleHQ6IHN0cmluZykge1xuICByZXR1cm4gdGV4dC5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb29yZGluYXRlV2l0aGluUmVjdChyZWN0OiBET01SZWN0LCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICByZXR1cm4gcmVjdC5sZWZ0IDwgeCAmJiB4IDwgcmVjdC5yaWdodCAmJiByZWN0LnRvcCA8IHkgJiYgeSA8IHJlY3QuYm90dG9tO1xufVxuXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0ZWQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgZWxlbWVudDogRWxlbWVudCwgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZyA9IG51bGwpIHt9XG5cbiAgZ2V0IGNsaWVudFJlY3QoKTogRE9NUmVjdCB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxufVxuIl19