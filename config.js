config = {
    'WHITE_ID':0,
    'WROTE_ID':1,
    'BLOCK_ID':2,
}
const N_STAGES = 10;
const WHITE_ID=0;
const WROTE_ID=1;
const BLOCK_ID=2;
const limitation_tiles_ratio = 0.8;

const tile_colors = [
    '#84302F',
    '#2F4E84',
    '#2F8439',
    '#592F84',
    '#846A2F',
    '#2F8482',
    '#842F60',
    '#3E2F84',
    '#7F842F',
    '#842F56'
]

const criteria = [
    '',
    '世界1で50ステージ以上',
    '世界2で100ステージ以上',
    '世界1,2,3の合計で\n300ステージ以上',
    '世界1,2,3,4の合計で\n600ステージ以上',
    '世界5で200ステージ以上',
    '世界6で300ステージ以上',
    '世界1,2,3,4,5,6,7の合計で\n2500ステージ以上',
    '世界8で500ステージ以上',
    '世界9で600ステージ以上',
    'Coming soon...'
]

let judge_criteria = [
    function(){return true},
    function(){
        return clear_count[0] >= 50;
    },
    function(){
        return clear_count[1] >= 100;
    },
    function(){
        return clear_count[0] + clear_count[1] + clear_count[2] >= 300;
    },
    function(){
        return clear_count[0] + clear_count[1] + clear_count[2] + clear_count[3] >= 600;
    },
    function(){
        return clear_count[4] >= 200;
    },
    function(){
        return clear_count[5] >= 300;
    },
    function(){
        sum = 0;
        for(let i=0;i<7;i++)sum += clear_count[i];
        return sum >= 2500;
    },
    function(){
        return clear_count[7] >= 500;
    },
    function(){
        return clear_count[8] >= 600;
    },
    function(){
        // coming soon
        return false;
    }
]
