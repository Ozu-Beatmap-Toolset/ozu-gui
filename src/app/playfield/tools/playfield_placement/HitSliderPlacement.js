const State = require('../../../../util/patterns/state_machine/State.js');
const RealtimeKB = require('../../../../util/user_input/RealtimeKB.js');
const Playfield = require('../../Playfield.js');
const unplacedSlider = require('../../../hit_objects/unplacedSlider.js');
const Vector2 = require('../../../../util/math/vector/Vector2.js');
const HitSliderCloner = require('../../../hit_objects/HitSliderCloner.js');
const AddSliderToPlayfield = require('../../../../util/actions/actions/AddSliderToPlayfield.js');
const BezierSamplerClient = require('../../../../util/math/curve/bezier/BezierSamplerClient.js');
const BezierCurve = require('../../../../util/math/curve/bezier/BezierCurve.js');

const REFRESH_RATE = 16; // ms

module.exports = class HitSliderPlacement extends State {
    #uiData;
    #interval;
    #bezierCurve;
    constructor(uiData, bezierCurve) {
        super();
        this.#uiData = uiData;
        unplacedSlider.getDomObject().style.setProperty('visibility', 'visible');
        this.#bezierCurve = bezierCurve;
    }

    unregister() {
        window.clearInterval(this.#interval);
        unplacedSlider.getDomObject().style.setProperty('visibility', 'hidden');
    }

    start(input) {
        // start to display the slider
        this.#interval = window.setInterval(() => this.repositionSliderControlPoint(input[0][1].get()), REFRESH_RATE);
        // add a control point to the curve
        unplacedSlider.addControlPoint(this.#uiData[0].playfieldPositionToOsuPixel(input[0][1].get()), this.#bezierCurve, this.#uiData[0]);
        // move the circle to the cursor for the first frame
        unplacedSlider.moveLastControlPointTo(input[0][1].get(), this.#bezierCurve, this.#uiData[0]);
    }

    exec(input) {
        if (input[1].type == 'mousedown') {
            if (input[1].buttons == 2) { // right click
                const hitSliderCopy = HitSliderCloner.cloneAt(unplacedSlider.getDomObject(), this.#uiData[0], this.#uiData[1].getCurrentPositionOnClosestDivision());
                new AddSliderToPlayfield(this.#uiData[2], hitSliderCopy, this.#uiData[1], this.#uiData[0], this.#bezierCurve).do();
            }
        }
    }

    next(input) {
        if (input[0][0].escPressed()) {
            // esc = cancel
            unplacedSlider.clearControlPoints();
            this.unregister();
            const IdleTool = require('../IdleTool.js');
            return new IdleTool(this.#uiData);
        }
        if (input[1].type == 'mousedown') {
            // right click = we're done the slider is placed
            if (input[1].buttons == 2) {
                unplacedSlider.clearControlPoints();
                this.unregister();
                const IdleTool = require('../IdleTool.js');
                return new IdleTool(this.#uiData);
            }
            // left click = add a new control-point
            if (input[1].buttons == 1) {
                this.unregister();
                return new HitSliderPlacement(this.#uiData, this.#bezierCurve);
            }
        }
        return this;
    }

    repositionSliderControlPoint(cursorPosition) {
        unplacedSlider.moveLastControlPointTo(cursorPosition, this.#bezierCurve, this.#uiData[0]);
    }
}
