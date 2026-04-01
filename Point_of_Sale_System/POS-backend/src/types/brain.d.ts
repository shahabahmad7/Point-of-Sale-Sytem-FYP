declare module 'brain.js' {
  export class NeuralNetwork {
    constructor(options?: {
      activation?: string;
      hiddenLayers?: number[];
      learningRate?: number;
    });
    train(
      data: Array<{ input: number[]; output: number[] }>,
      options?: {
        iterations?: number;
        errorThresh?: number;
        log?: boolean | ((info: any) => void);
      }
    ): { error: number; iterations: number };
    run(input: number[]): number[] | number;
  }

  export interface TrainingData {
    input: number[];
    output: number[];
  }

  export default {
    NeuralNetwork,
  };
}
