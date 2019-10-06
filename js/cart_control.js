//Javascript control program
//M J Livesey


//ES6 PUBLIC EXPORT
var cartControl = {};
export default cartControl
import $def from './defs.js';

//itemData hardcoded for test - in production verison it would be imported dynamically via PDO or laravel & MYSQL database request
cartControl.itemData = {
    GOKU: { code: 'GOKU', name: 'Goku POP', price: 5, img: 'img/soda1.jpg', discountCode: 1 },
    NARU: { code: 'NARU', name: 'Naruto POP', price: 20, img: 'img/soda2.jpg', discountCode: 2 },
    LUF: { code: 'LUF', name: 'Luffy POP', price: 7.5, img: 'img/soda3.jpg', discountCode: undefined },
}
//empty basket
cartControl.basket = {};
cartControl.elList = {};

cartControl.wait = function(time){
    return new Promise((resolve) => setTimeout(()=>resolve(), time));
  }

/**
 * @public
 * @description
 * add remove cart item
 * @param {Object} e
 */
cartControl.addRemoveItem = function (e, elList) {
    var code, el;
    if (e.target.hasAttribute('addone')) {
        code = e.target.getAttribute('addone');
        if (!cartControl.basket[code]) { cartControl.basket[code] = 1 }
        else { cartControl.basket[code] += 1 }
        el = elList.querySelector(`[quantityGUID = "${code}"]`);
        el.innerText = cartControl.basket[code];
        el = elList.querySelector(`[totalGUID = "${code}"]`);
        el.innerText = cartControl.basket[code] * cartControl.itemData[code].price + '€' ;
        cartControl.updateTotals(cartControl.basket);
    }
    if (e.target.hasAttribute('subone')) {
        code = e.target.getAttribute('subone');
        if (!cartControl.basket[code]) { cartControl.basket[code] = 0 }
        else { cartControl.basket[code] -= 1 }
        if (cartControl.basket[code] < 0) { cartControl.basket[code] = 0; }
        el = elList.querySelector(`[quantityGUID = "${code}"]`);
        el.innerText = cartControl.basket[code];
        el = elList.querySelector(`[totalGUID = "${code}"]`);
        el.innerText = cartControl.basket[code] * cartControl.itemData[code].price + '€' ;
        cartControl.updateTotals(cartControl.basket);
    }
}

/**
 * @public
 * @description
 * update totals
 * @param {Object} basket
 */
cartControl.updateTotals = function (basket) {
    var el, subTotal, itemCount, discount;
    subTotal = 0;
    itemCount = 0;
    for (let item in basket) {
        itemCount += basket[item];
        subTotal += cartControl.itemData[item].price * basket[item];
    }
    el = document.getElementsByClassName('item-subtotal')[0];
    if (itemCount === 1) { el.children[0].innerText = itemCount + ' item'; }
    else { el.children[0].innerText = itemCount + ' items'; }
    el.children[1].innerText = subTotal + '€';
    discount = cartControl.applyDiscount(basket);
    el = document.getElementById('totalCost');
    el.innerText = `${subTotal - discount}€`

}

/**
 * @public
 * @description
 * apply discount
 * @param {Object} basket
 * @returns {Number}
 */
cartControl.applyDiscount = function (basket) {
    var el, itemDiscount, totalDiscount;
    totalDiscount = 0;
    el = document.getElementsByClassName('item-discount-wrapper')[0];
    el.innerHTML = '';
    for (let code in basket) {
        itemDiscount = 0;
        switch (cartControl.itemData[code].discountCode) {
            case 1:
                if (basket[code] > 0) {
                    itemDiscount = Math.floor(basket[code] / 3) * 5;
                    if (itemDiscount > 0) {
                        el.insertAdjacentHTML('beforeend', $def.discountTemplate(code, itemDiscount, cartControl.itemData[code].name));
                    }
                    totalDiscount += itemDiscount;
                }
                break;
            case 2:
                if (basket[code] >= 3) {
                    itemDiscount = itemDiscount + basket[code] * 1;
                    el.insertAdjacentHTML('beforeend', $def.discountTemplate(code, itemDiscount, cartControl.itemData[code].name, basket[code]));
                }
                totalDiscount += itemDiscount;
                break;
        }
    }
    if (totalDiscount !== 0){
        el.insertAdjacentHTML('afterbegin', `<div class="discount-header item-text-light">DISCOUNTS</div>`);
    }
    return totalDiscount;
}

