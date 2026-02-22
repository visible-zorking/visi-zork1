import { unpack_address } from '../visi/gametypes';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from './gamedat';
import { GnustoEngine, ZState, ZStatePlus } from '../visi/zstate';
import { ExtraToggle } from '../visi/map';

/* Pull the "probability of waking" (V-PROB) entries out of the VILLAINS
   table. We'll display these in the Combat tab.
*/
export function get_combat_info(engine: GnustoEngine, state: ZState): any
{
    let trollwake = engine.getWord(11827);
    let thiefwake = engine.getWord(11837);
    let cyclopswake = engine.getWord(11847);
    return {
        awaken: [ trollwake, thiefwake, cyclopswake ]
    };
}

export function map_toggle_doors(zstate: ZStatePlus): ExtraToggle[]
{
    // Once again we rely on the fact that the zstate reports objects in order (1-based).
    let trapflag = zstate.objects[182].attrs & 0x100000; // TRAP-DOOR & OPENBIT
    let trapstate = trapflag ? 'Invisible' : 'Visible';
    let grateflag = zstate.objects[173].attrs & 0x100000; // GRATE & OPENBIT
    let gratestate = grateflag ? 'Invisible' : 'Visible';
    let magicflag = zstate.globals[143]; // MAGIC-FLAG
    let magicstate = magicflag ? 'Invisible' : 'Visible';
    let rainbowflag = zstate.globals[142]; // RAINBOW-FLAG
    let rainbowstate = rainbowflag ? 'Invisible' : 'Visible';
    let lldflag = zstate.globals[145]; // LLD-FLAG
    let lldstate = lldflag ? 'Invisible' : 'Visible';
    
    return [
        { id: 'toggle-trap-door-1', class: trapstate },
        { id: 'toggle-trap-door-2', class: trapstate },
        { id: 'toggle-grating-1', class: gratestate },
        { id: 'toggle-grating-2', class: gratestate },
        { id: 'toggle-magic-flag-1', class: magicstate },
        { id: 'toggle-magic-flag-2', class: magicstate },
        { id: 'toggle-rainbow-flag-1', class: rainbowstate },
        { id: 'toggle-rainbow-flag-2', class: rainbowstate },
        { id: 'toggle-lld-flag', class: lldstate },
    ];
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    if (topic == 'BATTERIES') {
        refresh_batteries(engine);
    }

    return null;
}

/* A terrible hack: dig into the VM and overwrite the I-LANTERN timer
   entry with 5000!
*/
function refresh_batteries(engine: GnustoEngine)
{
    // This should be the same as the last report we got this turn.
    let report = engine.get_vm_report();

    // Locate the timer entry for I-LANTERN.
    let I_LANTERN = gamedat_routine_names.get('I-LANTERN');
    if (!I_LANTERN)
        return;

    let C_TABLE = gamedat_global_names.get('C-TABLE');
    if (!C_TABLE)
        return;

    let C_INTS = gamedat_global_names.get('C-INTS');
    if (!C_INTS)
        return;

    let pos = report.globals[C_INTS.num];
    let countpos = 0;
    while (pos+5 < report.timertable.length) {
        let addr = report.timertable[pos+4] * 0x100 + report.timertable[pos+5];
        if (unpack_address(addr) == I_LANTERN.addr) {
            let ctableaddr = report.globals[C_TABLE.num];
            countpos = ctableaddr+pos+2;
            break;
        }
        pos += 6;
    }

    if (!countpos) {
        console.log('BUG: could not find I-LANTERN timer');
        return;
    }

    engine.setWord(5000, countpos);

    // But now we have to trigger the generation of a new report,
    // so that the Timers UI updates. This is a hack; it leaves the
    // Activity tab looking bare. Sorry! You want new batteries, you
    // gotta put up with some jank.
    
    engine.reset_vm_report();
    window.dispatchEvent(new Event('zmachine-update'));
}
