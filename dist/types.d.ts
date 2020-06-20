export declare type LootItem = {
    count: number;
    data: {
        name: string;
    };
};
export declare type LootContainer = {
    [key: string]: LootItem;
};
export declare type DataBase = {
    username: string;
    x: number;
    y: number;
    supplies: LootContainer;
    exe_js?: string;
    gained_xp?: number;
    skills: {
        sp: number;
        level: number;
        next_level_xp: number;
        hp: number;
        max_hp: number;
        max_sp: number;
        dmg: number;
        max_carry: number;
        carry: number;
        skill_points: number;
        xp: number;
    };
    craft_queue?: {
        [key: string]: {
            item_id: string;
            remaining: number;
        };
    };
    proximity?: {
        objs: {
            char: string;
            x: number;
            y: number;
        }[];
    };
};
export declare type Buttons = {
    [key: string]: {
        text: string;
        req_met?: boolean;
        req_is_now_locked?: boolean;
    };
};
export declare type GameEventData = {
    state: "event";
    event_data: {
        visited: boolean;
        stage_data: {
            title: string;
            desc: string;
            visited: string;
            btns: Buttons;
        };
    };
};
export declare type GameLootingData = {
    state: "looting";
    loot: {
        items: LootContainer;
        title: string;
        desc: string;
        visitdesc: string;
        visited: boolean;
    };
};
export declare type GameIntData = {
    state: "int";
};
export declare type GameTravelData = {
    state: "travel";
};
export declare type GameData = DataBase & (GameLootingData | GameTravelData | GameEventData | {
    state: "???";
} | GameIntData);
export declare type SendMsg = {
    action: "setDir";
    dir: string;
    autowalk: boolean;
} | {
    action: "event_choice";
    option: string;
} | {
    action: "loot_exchange";
    which: true | false;
    item: string;
    amount: number;
} | {
    action: "loot_next";
} | {
    action: "doublestep";
    option: "add";
} | {
    action: "skill_upgrade";
    carry: number;
    dmg: number;
    hp: number;
    sp: number;
} | {
    action: "equipment";
    option: "find_all" | "dig" | "dig_with_shovel";
} | {
    action: "equip";
    item: "metal_detector" | "shovel";
} | {
    action: "leave_int";
};
