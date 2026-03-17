
/* Return the initial sourceloc to display. */
export function sourceloc_start() : string
{
    return 'J:78:1:102:0';  // 'gverbs.zil', lines 78-101
}

// Presentation order. Filenames must match game-info!
export const sourcefile_presentation_list: string[] = [
    'zork1.zil',
    '1actions.zil',
    '1dungeon.zil',
    'gmain.zil',
    'gmacros.zil',
    'gglobals.zil',
    'gparser.zil',
    'gsyntax.zil',
    'gverbs.zil',
    'gclock.zil',
];
