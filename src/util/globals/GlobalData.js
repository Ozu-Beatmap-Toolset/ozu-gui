import { reactive } from 'vue';
import SelectTool from '@/../src/app/ui/playfield/tools/SelectTool.js';
import Vector2 from '@/../src/util/math/vector/Vector2.js';
import CursorPosition from "@/../src/util/user_input/CursorPosition.js";
import { skin } from '@/../src/app/game_data/skin/skinData.js';
import { uuid } from '@/../src/util/uuid/uuid.js';

export const appData = reactive({
    userInput: {
        mouseCursor: new CursorPosition(),
    },
    uuid: () => {
        return uuid();
    },
    playfield: {
        isMouseHovering: false,
        currentUserTool: new SelectTool(),
        hitobjects: [],
        selection: {
            indexes: [],
            focus: -1,
        },
        originPosition: new Vector2(0, 0),
    },
    timeline: {
        redLines: [],
        timeDivision: 1,
        position: 0,
    },
    skin: skin
})