document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('breakfastForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const productCards = document.querySelectorAll('.product-card');
    const modal = document.getElementById('productModal');
    const modalProductName = document.getElementById('modalProductName');
    const modalQuantity = document.getElementById('modalQuantity');
    const modalOptions = document.getElementById('modalOptions');
    const modalAddButton = document.getElementById('modalAddButton');

    const productOptions = {
        'Succo': ['Arancia', 'Mela', 'Ananas'],
        'Tè': ['Nero', 'Verde', 'Camomilla']
    };

    const selectedProducts = [];

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const product = card.dataset.product;
            openModal(product);
        });
    });

    function openModal(product) {
        modalProductName.textContent = product;
        modalQuantity.value = 1;

        // Pulisci le opzioni precedenti
        modalOptions.innerHTML = '';

        // Aggiungi opzioni se necessario
        if (productOptions[product]) {
            const optionsHtml = productOptions[product].map(option => 
                `<label>
                    <input type="radio" name="productOption" value="${option}">
                    ${option}
                </label>`
            ).join('');
            modalOptions.innerHTML = `<p>Scegli il gusto:</p>${optionsHtml}`;
        }

        modal.style.display = 'block';
    }

    modalAddButton.addEventListener('click', () => {
        const product = modalProductName.textContent;
        const quantity = parseInt(modalQuantity.value);
        let option = '';

        if (productOptions[product]) {
            const selectedOption = document.querySelector('input[name="productOption"]:checked');
            if (selectedOption) {
                option = selectedOption.value;
            } else {
                alert('Per favore, seleziona un\'opzione.');
                return;
            }
        }

        selectedProducts.push({ product, quantity, option });
        modal.style.display = 'none';
        updateProductCards();
    });

    function updateProductCards() {
        productCards.forEach(card => {
            const product = card.dataset.product;
            const selectedProduct = selectedProducts.find(p => p.product === product);
            if (selectedProduct) {
                card.classList.add('selected');
                card.innerHTML = `
                    <h4>${product}</h4>
                    <p>Quantità: ${selectedProduct.quantity}</p>
                    ${selectedProduct.option ? `<p>Opzione: ${selectedProduct.option}</p>` : ''}
                `;
            }
        });
    }

    // Gestione dei menu a tendina personalizzati
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(customSelect => {
        const selectSelected = customSelect.querySelector('.select-selected');
        const selectItems = customSelect.querySelector('.select-items');
        const hiddenInput = customSelect.querySelector('input[type="hidden"]');

        selectSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('select-arrow-active');
            selectItems.classList.toggle('select-hide');
            customSelect.classList.toggle('active');
        });

        selectItems.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                selectSelected.textContent = this.textContent;
                hiddenInput.value = this.getAttribute('data-value');
                this.parentNode.classList.add('select-hide');
                selectSelected.classList.remove('select-arrow-active');
                customSelect.classList.remove('active');
            });
        });
    });

    document.addEventListener('click', function(e) {
        customSelects.forEach(customSelect => {
            const selectItems = customSelect.querySelector('.select-items');
            const selectSelected = customSelect.querySelector('.select-selected');
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            customSelect.classList.remove('active');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const roomNumber = document.getElementById('roomNumber').value;
        const timeSlot = document.getElementById('timeSlot').value;
        const breakfastLocation = document.getElementById('breakfastLocation').value;
        
        // Qui puoi aggiungere la logica per inviare l'ordine al server
        console.log({ name, roomNumber, selectedProducts, timeSlot, breakfastLocation });

        // Personalizza il messaggio di conferma
        const confirmationSubtitle = document.getElementById('confirmationSubtitle');
        if (breakfastLocation === 'camera') {
            confirmationSubtitle.textContent = `La tua colazione verrà consegnata in camera alle ore ${timeSlot}.`;
        } else {
            confirmationSubtitle.textContent = `La tua colazione sarà pronta alle ore ${timeSlot} nella sala colazioni.`;
        }

        // Mostra il messaggio di conferma
        form.style.display = 'none';
        confirmationMessage.style.display = 'block';
    });

    // Chiudi il modal se si clicca fuori da esso
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Gestione dei pulsanti + e - nel modal
    const modalMinusBtn = modal.querySelector('.minus');
    const modalPlusBtn = modal.querySelector('.plus');

    modalMinusBtn.addEventListener('click', () => {
        if (modalQuantity.value > 1) {
            modalQuantity.value = parseInt(modalQuantity.value) - 1;
        }
    });

    modalPlusBtn.addEventListener('click', () => {
        if (modalQuantity.value < 5) {
            modalQuantity.value = parseInt(modalQuantity.value) + 1;
        }
    });
});