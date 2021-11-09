import {TIVRTestRunner} from "@in2cloud/in2cloud-cli/lib/common/src/sandbox/testrunner";
import {TIVRParserJSON} from "@in2cloud/in2cloud-cli/lib/common/src/parser/parser";
import {TBlockCollection} from "@in2cloud/in2cloud-cli/lib/common/src/blocks";

test('IVR Simple Echo', () => {

    let ivrMessages: string[] = [];

    const root: TBlockCollection = new TIVRParserJSON()
        .include(require("../src/simple_echo.json"))
        .parse("simple_echo")

    const ivr: TIVRTestRunner = new TIVRTestRunner(root as TBlockCollection, {})

    ivr.onMessagePlay = message => {
        ivrMessages.push(message)
    }

    //Start flow
    ivr.start();

    //Expect prompt to be played
    expect(ivrMessages).toEqual(["Please enter any number, then press #"])

    //Clear played messages buffer
    ivrMessages = [];

    //Emulate phone key presses
    ivr.press(1, 2, 3, '#');

    //Expect the entered number to be played back
    expect(ivrMessages).toEqual(["You have entered 123"])

    //Check the flow disconnected successfully
    expect(ivr.state).toEqual("wrapper.caller.disconnect")
})
