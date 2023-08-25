export interface SeederInterface {
    seed: () => { model: any, values: object[] }
}