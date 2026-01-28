async function authenticateUser(userId, isAuthenticated) {
    const action = isAuthenticated ? 'authenticate' : 'revoke';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
        const response = await fetch(`/admin/authenticate/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isAuthenticated })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert(data.message || 'Failed to update authentication');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

async function toggleAdmin(userId, isAdmin) {
    const action = isAdmin ? 'promote to admin' : 'remove admin status from';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
        const response = await fetch(`/admin/toggle-admin/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isAdmin })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(data.message);
            location.reload();
        } else {
            alert(data.message || 'Failed to update admin status');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

async function viewGifts(userId) {
    try {
        const response = await fetch(`/admin/user-gifts/${userId}`);
        const data = await response.json();
        
        if (data.success) {
            const modal = document.getElementById('giftsModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            
            modalTitle.textContent = `${data.user.user_name}'s Wishlist`;
            
            if (data.gifts && data.gifts.length > 0) {
                modalBody.innerHTML = data.gifts.map(gift => `
                    <div class="modal-gift-item">
                        <span class="modal-gift-number">#${gift.gift_order}</span>
                        <span class="modal-gift-desc">${gift.gift_description}</span>
                        <span class="modal-gift-price">$${gift.price}</span>
                    </div>
                `).join('');
            } else {
                modalBody.innerHTML = '<p class="no-data">No gifts added yet.</p>';
            }
            
            modal.style.display = 'block';
        } else {
            alert(data.message || 'Failed to load gifts');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

async function viewValentine(userId) {
    try {
        const response = await fetch(`/admin/user-valentine/${userId}`);
        const data = await response.json();
        
        if (data.success) {
            const modal = document.getElementById('giftsModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            
            modalTitle.textContent = `Secret Valentine Assignment`;
            
            if (data.valentine) {
                modalBody.innerHTML = `
                    <div class="valentine-reveal">
                        <p class="valentine-info">This user gives a gift to:</p>
                        <h3 class="valentine-name">${data.valentine.user_name}</h3>
                        <p class="valentine-id">ID: ${data.valentine.id}</p>
                    </div>
                `;
            } else {
                modalBody.innerHTML = '<p class="no-data">No valentine assigned yet. Click "Assign Secret Valentines" button.</p>';
            }
            
            modal.style.display = 'block';
        } else {
            alert(data.message || 'Failed to load valentine');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

async function deleteUser(userId) {
    if (!confirm('⚠️ WARNING: This will permanently delete this user and all their data. Are you absolutely sure?')) return;
    
    try {
        const response = await fetch(`/admin/delete-user/${userId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('User deleted successfully');
            location.reload();
        } else {
            alert(data.message || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

async function assignValentines() {
    if (!confirm('This will randomly assign all authenticated users to each other. Continue?')) return;
    
    try {
        const response = await fetch('/admin/assign-valentines', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(`✅ ${data.message}`);
        } else {
            alert(data.message || 'Failed to assign valentines');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}

function closeModal() {
    document.getElementById('giftsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('giftsModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
