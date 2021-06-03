type RoleType = 'ADMIN' | 'USER'

declare namespace Express {
    interface Request {
        user: { id: number }
    }
}

interface User {
    id: number
    name: string
    password: string
}

interface Account {
    id: number
    userId: number
    amount: number
    type: 'DEPOSIT' | 'WITHDRAW'
}
