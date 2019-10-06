//Javascript definition module - shopping cart test
//M J Livesey

var $def = {}
export default $def


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
<div class="s2 li-item"><p class="item-control no-select" subone="${code}">-</p><div class="quantity-box item-text" quantityGUID="${code}">0</div><p class="item-control no-select" addone="${code}">+</p></div> 
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
$def.discountTemplate = function (code, discount, name, number) {
    if (!number) {
        return `<div class="item-discount"><div class="item-text-light">2-get-1 free ${name} offer</div><div class="item-text">-${discount}€</div></div>`

    }
    else {
        return `<div class="item-discount"><div class="item-text-light">${number} x ${name} offer</div><div class="item-text">-${discount}€</div></div>`
    }
}