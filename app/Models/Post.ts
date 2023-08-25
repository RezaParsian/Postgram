import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "./User";
import {PostInfo} from "../../src/Post/PostTypes";
import {PostLog} from "./PostLog";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User, (user: User) => user.id, {
        createForeignKeyConstraints: false,
    })
    user?: User | number;

    @OneToMany(() => PostLog, (postLog: PostLog) => postLog.post)
    postLogs?: PostLog[];

    @Column({
        type: 'varchar',
        length: 128
    })
    code?: string

    @Column({
        type: 'simple-json',
    })
    data?: PostInfo

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at?: Date;

    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updated_at?: Date;
}