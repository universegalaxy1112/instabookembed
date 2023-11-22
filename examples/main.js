let ibEmbed;
function initialize() {
    if (ibEmbed) {
        return;
    }
    ibEmbed= new InstabookEmbed({
        id: 'id-to-element',
        businessID: 'easytiger',
        fitContent: true,
        showLoader: true
    });
    ibEmbed.init();
    ibEmbed.addEventListener('iframe:resize', function(data) {
        console.log('iframe resize:', data);
    })
}

function destroy() {
    if (ibEmbed) {
        ibEmbed.reset();
        ibEmbed = null;
    }
}
