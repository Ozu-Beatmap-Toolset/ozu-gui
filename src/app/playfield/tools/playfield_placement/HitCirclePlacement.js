const State = require('../../../../util/patterns/state_machine/State.js');
const RealtimeKB = require('../../../../util/user_input/RealtimeKB.js');
const Playfield = require('../../Playfield.js');
const playfieldInserter = require('../../playfieldInserter.js');
const HitCircle = require('../../../hit_objects/HitCircle.js');
const unplacedCircle = require('../../../hit_objects/unplacedCircle.js');
const Vector2 = require('../../../../util/math/vector/Vector2.js');
const skinSetter = require('../../../skin/skinSetter.js');

module.exports = class HitCirclePlacement extends State {
    #mouseMoveListenerMethod = (event) => { this.mouseMoved(event); };
    #uiData;

    constructor(uiData) {
        super();
        this.#uiData = uiData;
        window.addEventListener('mousemove', this.#mouseMoveListenerMethod);
        const unplacedCircle = document.querySelector(".unplaced-circle");
        unplacedCircle.style.setProperty('visibility', 'visible');
    }

    unregister() {
        window.removeEventListener('mousemove', this.#mouseMoveListenerMethod);
        const unplacedCircle = document.querySelector(".unplaced-circle");
        unplacedCircle.style.setProperty('visibility', 'hidden');
    }

    start(input) {
        // move the circle to the cursor for the first frame
        unplacedCircle.moveTo(input[0][1].get(), this.#uiData[0]);
    }

    exec(input) {
        if (input[1].type == 'mousedown') {
            if (input[1].buttons == 1) {
                const unplacedCircle = document.querySelector('.unplaced-circle');
                const hitCircleCopy = HitCircle.cloneAt(unplacedCircle, this.#uiData[0], this.#uiData[1].getCurrentPositionOnClosestDivision());
                playfieldInserter.insert(hitCircleCopy);
            }
        }
    }

    next(input) {
        if (input[0][0].escPressed()) {
            this.unregister();
            const IdleTool = require('../IdleTool.js');
            return new IdleTool(this.#uiData);
        }
        if (input[1].type == 'mousedown') {
            if (input[1].buttons == 2) {
                this.unregister();
                const IdleTool = require('../IdleTool.js');
                return new IdleTool(this.#uiData);
            }
        }
        return this;
    }

    mouseMoved(event) {
        unplacedCircle.moveTo(new Vector2(event.clientX, event.clientY), this.#uiData[0]);
    }
}