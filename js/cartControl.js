//Javascript control program
//M J Livesey
//production version should be ES6 module export default cartControl

//ES6 PUBLIC EXPORT
var cartControl = {};
//ES6 PRIVATE
var $def = {}

//itemData hardcoded for test - in production verison it would be imported dynamically via PDO or laravel & MYSQL database request
cartControl.itemData = {
    GOKU: { code: 'GOKU', name: 'Goku POP', price: 5, img: 'img/soda1.jpg', discountCode: 1 },
    NARU: { code: 'NARU', name: 'Naruto POP', price: 20, img: 'img/soda2.jpg', discountCode: 2 },
    LUF: { code: 'LUF', name: 'Luffy POP', price: 7.5, img: 'img/soda3.jpg', discountCode: undefined },
}
//empty basket
cartControl.basket = {};
cartControl.elList = {};

/**
 * @public
 * @description
 * template for inserting items into html ul tag
 * @param {String} name
 * @param {String} code
 * @param {String} price
 * @param {String} img
 */
$def.listItemTemplate = function (name, code, price, img) {
    return `<li class="li-ip li-item">
<div class="s1 li-item"><img src="${img}" class="li-image"><div class="item-description"><h2>${name}</h2><p class="item-text-light">PRODUCT CODE: ${code}</p></div></div>
<div class="s2 li-item"><p class="item-control" subone="${code}">-</p><div class="quantity-box item-text" quantityGUID="${code}">0</div><p class="item-control" addone="${code}">+</p></div> 
<div class="s3 li-item"><div class="item-text">${price}€</div></div>
<div class="s4 li-item"><div class="item-text li-total" totalGUID="${code}">0€</div></div>
</li>`}


/**
 * @public
 * @description
 * template for inserting items into html discount section
 * @param {String} code
 * @param {String} discount
 * @param {Number} number
 */
$def.discountTemplate = function (code, discount, number) {
    if (!number) {
        return `<div class="item-discount"><div class="item-text-light">2-for-1 ${cartControl.itemData[code].name} offer</div><div class="item-text">-${discount}€</div></div>`

    }
    else {
        return `<div class="item-discount"><div class="item-text-light">${number} x ${cartControl.itemData[code].name} offer</div><div class="item-text">-${discount}€</div></div>`
    }
}


/**
 * @public
 * @description
 * add remove cart item
 * @param {Object} e
 */
cartControl.addRemoveItem = function (e) {
    var code, el;
    if (e.target.hasAttribute('addone')) {
        code = e.target.getAttribute('addone');
        if (!cartControl.basket[code]) { cartControl.basket[code] = 1 }
        else { cartControl.basket[code] += 1 }
        el = cartControl.elList.querySelector(`[quantityGUID = "${code}"]`);
        el.innerText = cartControl.basket[code];
        el = cartControl.elList.querySelector(`[totalGUID = "${code}"]`);
        el.innerText = cartControl.basket[code] * cartControl.itemData[code].price + '€' ;
        cartControl.updateTotals(cartControl.basket);
    }
    if (e.target.hasAttribute('subone')) {
        code = e.target.getAttribute('subone');
        if (!cartControl.basket[code]) { cartControl.basket[code] = 0 }
        else { cartControl.basket[code] -= 1 }
        if (cartControl.basket[code] < 0) { cartControl.basket[code] = 0; }
        el = cartControl.elList.querySelector(`[quantityGUID = "${code}"]`);
        el.innerText = cartControl.basket[code];
        el = cartControl.elList.querySelector(`[totalGUID = "${code}"]`);
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
    var el, subTotal, itemCount;
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
    for (let item in basket) {
        itemDiscount = 0;
        switch (cartControl.itemData[item].discountCode) {
            case 1:
                if (basket[item] > 0) {
                    itemDiscount = Math.floor(basket[item] / 3) * 5;
                    if (itemDiscount > 0) {
                        el.insertAdjacentHTML('beforeend', $def.discountTemplate(item, itemDiscount));
                    }
                    totalDiscount += itemDiscount;
                }
                break;
            case 2:
                if (basket[item] >= 3) {
                    itemDiscount = itemDiscount + basket[item] * 1;
                    el.insertAdjacentHTML('beforeend', $def.discountTemplate(item, itemDiscount, basket[item]));
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



//initialization routine - in production version this would be called in AJAX request after fetch of data
cartControl.elList = document.getElementById('list-items-all');
cartControl.eventListener = { handleEvent: (e) => cartControl.addRemoveItem(e) }
cartControl.elList.addEventListener('click', cartControl.eventListener);

for (let data in cartControl.itemData) {
    cartControl.elList.insertAdjacentHTML(
        'beforeend',
        $def.listItemTemplate(
            cartControl.itemData[data].name,
            cartControl.itemData[data].code,
            cartControl.itemData[data].price,
            cartControl.itemData[data].img));
}