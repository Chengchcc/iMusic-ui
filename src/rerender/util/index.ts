export const range = (start: number, end: number, step = 1): Array<number> =>
    new Array(Math.ceil((end - start) / step))
        .fill(start)
        .map((el, i) => el + i - 1 + step);

export const shuffle = <T>(array: Array<T>) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export const readableSecond = (milsecondValue: number) => {
    if (isNaN(milsecondValue)) {
        return "0:00";
    }
    const secondValue = milsecondValue / 1000;
    const hours = Math.floor(secondValue / 60 / 60);
    const minutes = Math.floor(secondValue / 60) % 60;
    const seconds = Math.floor(secondValue - hours * 60 * 60 - minutes * 60);
    const secondss =
        seconds < 10 ? "0" + seconds.toString() : seconds.toString();
    if (hours) {
        return hours.toString() + ":" + minutes.toString() + ":" + secondss;
    }
    return minutes.toString() + ":" + secondss;
};

export function chunk(item: any[], size: number) {
    if (item.length <= 0 || size <= 0) {
        return item;
    }

    const chunks = [];

    for (let i = 0; i < item.length; i = i + size) {
        chunks.push(item.slice(i, i + size));
    }

    return chunks;
}
