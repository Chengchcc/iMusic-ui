export const range = (start: number, end: number, step = 1): Array<number> =>
    new Array(Math.ceil((end - start) / step))
        .fill(start)
        .map((el, i) => el + i + step);

export const shuffle = <T>(array: Array<T>) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
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
