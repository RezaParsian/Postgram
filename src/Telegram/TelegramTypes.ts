export type Message = {
    update_id: number,
    message: {
        message_id: number,
        from: {
            id: number,
            is_bot: boolean,
            first_name: string,
            last_name: string,
            username: string,
            language_code: string,
            is_premium: boolean
        },
        chat: {
            id: number,
            first_name: string,
            last_name: string,
            username: string,
            type: string
        },
        date: number,
        text: string
    }
}