class Basket {
    constructor() {
        this.produits = this.getBasket()
    }

    /* Afficher le localStorage */
    getBasket() {
        let basket = localStorage.getItem("basket");
        // Si panier est vide alors on renvoie un tableau vide []
        if (basket == null) {
            basket = [];

        } else {
            // Sinon on parse (txt) le panier
            basket = JSON.parse(basket);
        }
        return basket;
    }

    /* Sauvegarder un produit dans le localStorage */
    save() {
        localStorage.setItem("basket", JSON.stringify(this.produits));
        console.log("Produit ajouté à votre basket.");
    }

    /* Ajouter un produit au panier */
    add(produitCanape) {
        // verification(s)
        if (produitCanape.qty == 0 ) {
            alert("Veuillez sélectionnez une quantité.");

        }else if(produitCanape.colors == "")
        {
            alert("Veuillez une couleur.");
        }
        else {
            // verification(s) ID - même article
            // Recherche le meme ID sur le produitCanape qui vient d'être soumis à l'ajout du panier
            let foundProduct =
                this.produits.find
                    (p => p.id == produitCanape.id && p.colors == produitCanape.colors);
            if (foundProduct !== undefined) {
                // Si different de undefined alors on ajoute la quantity ++
                foundProduct.qty = parseInt(produitCanape.qty) + parseInt(foundProduct.qty);
                // this.produits.push(produitCanape);
            } else {
                // Sinon on l'ajour normalement au panier
                this.produits.push(produitCanape)
            }
            
            // sauvegarde dans le panier avec la methode "save"
            this.save();
            window.location.href = 'cart.html';
        }
    }

    /* Effacer un produit par l'id */
    remove(produitCanape) {
        this.produits = this.produits.filter(p => p.id != produitCanape.id && p.colors != produitCanape.colors);
        this.save();
        this.getTotalPrice();
        this.getTotalProduct();
    }

    /* Change Qty par produit */
    changeQuantity(id, quantity, color) {
        console.log(id, quantity, color);
        // Recherche le meme ID sur le produitCanape qui vient d'être soumis à l'ajout du panier
        let foundProduct = this.produits.find(p => p.id == id && p.colors == color);
        console.log(foundProduct);
        if (foundProduct != undefined) {
            foundProduct.qty = quantity;
            this.save();
        }
        this.getTotalPrice();
        this.getTotalProduct();
    }

    /* Calcul la qty */
    getNumberProduct() {

        let number = 0;
        for (let product of this.basket) {
            number += product.quantity
        }
        return number
    }
    
    /* Calcul le prix total */
    async getTotalPrice() {

        let total = 0;
        for (let product of this.produits) {
            var price = await this.getPriceByApi(product.id);
            var totalProduit = parseInt(product.qty) * parseInt(price);
            total = total + totalProduit;
        }
        document.getElementById('totalPrice').textContent = total;
    }


    /* Calcul du prix total avec la qty */
    getTotalProduct() {

        let total = 0;
        for (let product of this.produits) {
            total += parseInt(product.qty);
        }
        document.getElementById('totalQuantity').textContent = total;
    }


    /* Récupère le prix de l'article par l'id */
    getPriceByApi(id) {
        return fetch('http://localhost:3000/api/products/' + id)
            .then((resp) => resp.json())
            .then(function (data) {
                return data.price;
            })
    }

    /* Efface le contenu du localStorage (basket) */
    getDestroy(){
        let basket = localStorage.getItem("basket");
        basket.clear();
    }

}