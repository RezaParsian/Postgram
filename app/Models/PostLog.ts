import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Post} from "./Post";

@Entity('post_logs')
export class PostLog {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Post, (post: Post) => post.id, {
        createForeignKeyConstraints: false,
    })
    post?: Post | number;

    @Column({
        type: 'varchar',
        length: 61,
    })
    date?: string;

    @Column({
        type: 'varchar',
        length: 1024 * 2,
    })
    description?: string;

    @Column({
        type: 'varchar',
        length: 254,
    })
    location?: string;

    @Column({
        type: 'varchar',
        length: 5,
    })
    time?: string;


    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at?: Date;

    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updated_at?: Date;
}