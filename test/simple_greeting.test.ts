import {TIVRTestRunner} from "@in2cloud/in2cloud-cli/lib/common/src/sandbox/testrunner";
import {TIVRParserJSON} from "@in2cloud/in2cloud-cli/lib/common/src/parser/parser";
import {TBlockCollection} from "@in2cloud/in2cloud-cli/lib/common/src/blocks";

test('IVR happy path', () => {

    let ivrMessages: string[] = [];

    const root: TBlockCollection = new TIVRParserJSON()
        .include(require("../src/simple_greeting.json"))
        .parse("simple_greeting")

    const ivr: TIVRTestRunner = new TIVRTestRunner(root as TBlockCollection, {})

    ivr.onMessagePlay = message => {
        ivrMessages.push(message)
    }

    ivr.start();
    //Expect parameterised promp to be played
    expect(ivrMessages).toEqual([
        "Welcome to simple greeting demo flow"
    ])

    //Check the flow disconnected successfully
    expect(ivr.state).toEqual("wrapper.caller.disconnect")
})
