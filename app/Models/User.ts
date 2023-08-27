import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Post} from "./Post";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id?: number

    @OneToMany(()=>Post,(post)=>post.user)
    posts?:Post[];

    @Column({
        type:'numeric',
        unique:true
    })
    from?:number;

    @Column({
        type:'numeric'
    })
    chat_id?:number;

    @Column({
        type:'varchar',
        length:128,
        name:'first_name',
        nullable:true,
    })
    firstName?:string;

    @Column({
        type:'varchar',
        length:128,
        name:'last_name',
        nullable:true,
    })
    lastName?:string;

    @Column({
        type:'varchar',
        length:128,
        name:'username',
        nullable:true,
    })
    userName?:string;

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at?: Date;

    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updated_at?: Date;
}