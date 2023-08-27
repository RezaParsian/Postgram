export type Consignment = {
    post_info: PostInfo,
    post_logs: PostLog[],
    postman?: string
}

export type PostInfo = {
    content?: string,
    type?: string,
    from?: string,
    to?: string,
    office?: string,
    sender?: string,
    receiver?: string,
    weight?: number,
    totalPrice?: string,
    accepted_at?: string,
    price?: {
        p1?: string,
        p2?: string,
        p3?: string,
        p4?: string,
        p5?: string,
        p6?: string,
        p7?: string,
        p8?: string,
    }
}

export type PostLog = {
    date?: string,
    description?: string,
    location?: string,
    time?: string
}