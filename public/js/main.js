/***
 * $(document).ready(function(){
    $('.delete-article').on('click', function(e){
        $target =$(e.target);
        const id=$target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url:'/article/delete/'+id,
            success: function(response){
                alert('deleting article');
                window.location.href='/'
            }

        });
    });

});
 */