import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { Point } from "geojson";

import { OperationVolume } from "./OperationVolume";
import { User } from "./User";
import { VehicleReg } from "./VehicleReg";
import { ContingencyPlan } from "./ContingencyPlan";
import { NegotiationAgreement } from "./NegotiationAgreement";
import { PriorityElements } from "./PriorityElements";

type operations_vol = Array<OperationVolume>;

export enum OperationState {
    PROPOSED = "PROPOSED"
    , ACCEPTED = "ACCEPTED"
    , ACTIVATED = "ACTIVATED"
    , CLOSED = "CLOSED"
    , NONCONFORMING = "NONCONFORMING"
    , ROGUE = "ROGUE"
}
export enum OperatonFaaRule {
    PART_107 = "PART_107"
    , PART_107X = "PART_107X"
    , PART_101E = "PART_101E"
    , OTHER = "OTHER"
}

@Entity()
export class Operation {
    @PrimaryGeneratedColumn("uuid")
    'gufi': string;
    // 'uss_name': string;
    // 'discovery_reference'?: string;
    @Column({ type: "timestamp" })
    'submit_time': string;
    @Column({ type: "timestamp" })
    'update_time': string;
    @Column({ nullable: true })
    'aircraft_comments'?: string;
    @Column({ nullable: true })
    'flight_comments'?: string;
    @Column({ nullable: true })
    'volumes_description'?: string;


    @Column({ nullable: true })
    'airspace_authorization'?: string;
    @Column({ nullable: true })
    'flight_number'?: string;

    @Column()
    'state': OperationState //"PROPOSED" | "ACCEPTED" | "ACTIVATED" | "CLOSED" | "NONCONFORMING" | "ROGUE";

    @Column("geometry", { nullable: true })
    'controller_location': Point;
    @Column("geometry", { nullable: true })
    'gcs_location'?: Point;

    @Column()
    'faa_rule': OperatonFaaRule // "PART_107" | "PART_107X" | "PART_101E" | "OTHER";

    // @Column(type => OperationVolume)
    @OneToMany(type => OperationVolume, operation_volume => operation_volume.operation, {
        eager: true,
        cascade: true
    })
    'operation_volumes': OperationVolume[];


    // 'uas_registrations': Array<UasRegistration>;

    @ManyToMany(type => VehicleReg
        , { eager: true }
    )
    @JoinTable()
    uas_registrations: VehicleReg[];

    @ManyToOne(type => User, {
        eager: false
    })
    'creator': User;

    @Column({ nullable: true })
    'contact'?: string;

    @ManyToMany(type => ContingencyPlan
        , { eager: true, cascade: true },
    )
    @JoinTable()
    'contingency_plans': ContingencyPlan[];

    @ManyToMany(type => NegotiationAgreement
        , { eager: true, cascade: true }
    )
    @JoinTable()
    'negotiation_agreements'?: NegotiationAgreement[];

    @Column(type => PriorityElements)
    // @JoinColumn()
    'priority_elements'?: PriorityElements;


    // 'metadata': EventMetadata;

    // @AfterLoad()
    // updateCounters() {
    //     if (this.likesCount === undefined)
    //         this.likesCount = 0;
    // }
}


