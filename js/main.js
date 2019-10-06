//Javascript control program - shopping cart test
//M J Livesey

import cartControl from './cart_control.js';
import $def from './defs.js';

//PRIVATE
var elList = document.getElementById('list-items-all');
var eventListener = { handleEvent: (e) => cartControl.addRemoveItem(e, elList) }
elList.addEventListener('click', eventListener);

/**
 * @public
 * @description
 * loads the cart data, staggers the results using async/await ES2017
 */
async function loadStaggeredData(){
    for (let data in cartControl.itemData) {
        await cartControl.wait(250);
        elList.insertAdjacentHTML(
            'beforeend',
            $def.listItemTemplate(
                cartControl.itemData[data].name,
                cartControl.itemData[data].code,
                cartControl.itemData[data].price,
                cartControl.itemData[data].img));
    }
}

//initialization routine - in production version this would be called in AJAX request after fetch of data
loadStaggeredData();