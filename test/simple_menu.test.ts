import {TIVRTestRunner} from "@in2cloud/in2cloud-cli/lib/common/src/sandbox/testrunner";
import {TIVRParserJSON} from "@in2cloud/in2cloud-cli/lib/common/src/parser/parser";
import {TBlockCollection} from "@in2cloud/in2cloud-cli/lib/common/src/blocks";

test('IVR Simple Menu', () => {

    let ivrMessages: string[] = [];

    const root: TBlockCollection = new TIVRParserJSON()
        .include(require("../src/simple_menu.json"))
        .parse("simple_menu")

    const ivr: TIVRTestRunner = new TIVRTestRunner(root as TBlockCollection, {})

    ivr.onMessagePlay = message => {
        ivrMessages.push(message)
    }

    //Start flow
    ivr.start();

    //Expect parameterised promp to be played
    expect(ivrMessages).toEqual(["Press 1 to repeat, 2 to disconnect"])

    //Emulate selection of option one
    ivr.press(1);

    //Expect the prompt to be repeated again
    expect(ivrMessages).toEqual([
        "Press 1 to repeat, 2 to disconnect",
        "Press 1 to repeat, 2 to disconnect"
    ])

    //Emulate selection of option two
    ivr.press(2);

    //Check the flow disconnected successfully
    expect(ivr.state).toEqual("wrapper.caller.disconnect")
})
