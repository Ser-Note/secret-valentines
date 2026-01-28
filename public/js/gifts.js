async function addGift() {
    const description = document.getElementById('giftDescription').value;
    const price = document.getElementById('giftPrice').value;
    
    if (!description || !price) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch('/gifts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, price: parseFloat(price) })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Gift added successfully!');
            location.reload();
        } else {
            alert(data.message || 'Failed to add gift');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

async function editGift(id) {
    const newDescription = prompt('Edit gift description:');
    const newPrice = prompt('Edit gift price:');
    
    if (!newDescription || !newPrice) return;
    
    try {
        const response = await fetch(`/gifts/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: newDescription, price: parseFloat(newPrice) })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Gift updated!');
            location.reload();
        } else {
            alert(data.message || 'Failed to update gift');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

async function deleteGift(id) {
    if (!confirm('Are you sure you want to delete this gift?')) return;
    
    try {
        const response = await fetch(`/gifts/delete/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Gift deleted!');
            location.reload();
        } else {
            alert(data.message || 'Failed to delete gift');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}
