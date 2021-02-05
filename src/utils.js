export function fire(eName, eDetail){
    window.dispatchEvent(new CustomEvent(eName, eDetail? eDetail : null));
}