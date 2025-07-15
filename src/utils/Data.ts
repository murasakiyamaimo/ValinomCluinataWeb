class Data {
    dimension: number;
    isUp: boolean;
    isMuted: boolean;
    frequency: number;

    constructor(dimension: number, isUp: boolean, isMuted: boolean, frequency: number) {
        this.dimension = dimension;
        this.isUp = isUp;
        this.isMuted = isMuted;
        this.frequency = frequency;
    }

    setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    clone(): Data {
        return new Data(this.dimension, this.isUp, this.isMuted, this.frequency);
    }
}

export default Data;