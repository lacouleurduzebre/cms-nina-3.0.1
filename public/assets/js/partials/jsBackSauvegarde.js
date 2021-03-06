$(document).ready(function() {
    /* BDD */
    /* Création de dump */
    $('#export-bdd').click(function(){
        $('#export-bdd + .loader').css('display', 'inline-block');
        $.ajax({
            url: Routing.generate('sauvegarderBDD'),
            method: "post"
        })
            .done(function(data){
                $('#export-bdd + .loader').hide();

                timestamp = data.substring(0, data.indexOf('*'));
                date = data.substring(data.indexOf('*')+1);

                $('#dumps-bdd tbody').append('<tr>\n' +
                    '                            <td>'+date+'</td>\n' +
                    '                            <td><a class="telechargementDump" href="/admin/sauvegarde/telechargerDump?type=bdd&fichier=dump'+timestamp+'.zip"><i class="fas fa-file-download"></i></a></td>\n' +
                    '                            <td><a id="dump'+timestamp+'.zip" href="#" class="export-bdd-supprimer"><i class="fas fa-trash"></i></a></td>\n' +
                    '                        </tr>');
            })
            .fail(function(){
            });
    });

    /* Suppression de dump */
    $('.sauvegarde').on('click', '.export-bdd-supprimer', function(){
        fichier = $(this).attr('id');
        element = $(this);
        $.ajax({
            url: Routing.generate('supprimerDumps'),
            method: "post",
            data: {fichier: fichier, type: 'bdd'}
        })
            .done(function(){
                element.closest('tr').remove();
            })
    });

    /* Médiathèque */
    /* Création de dump */
    $('#export-mediatheque').click(function(){
        $('#export-mediatheque + .loader').css('display', 'inline-block');
        $.ajax({
            url: Routing.generate('sauvegarderMediatheque'),
            method: "post"
        })
            .done(function(data){
                $('#export-mediatheque + .loader').hide();

                timestamp = data.substring(0, data.indexOf('*'));
                date = data.substring(data.indexOf('*')+1);

                $('#dumps-mediatheque tbody').append('<tr>\n' +
                    '                        <td>'+date+'</td>\n' +
                    '                        <td><a class="telechargementDump" href="/admin/sauvegarde/telechargerDump?type=mediatheque&fichier=mediatheque'+timestamp+'.zip"><i class="fas fa-file-download"></i></a></td>\n' +
                    '                        <td><a id="mediatheque'+timestamp+'.zip" href="#" class="export-mediatheque-supprimer"><i class="fas fa-trash"></i></a></td>\n' +
                    '                    </tr>');
            })
    });

    /* Suppression de dump */
    $('.sauvegarde').on('click', '.export-mediatheque-supprimer', function(){
        fichier = $(this).attr('id');
        element = $(this);
        $.ajax({
            url: Routing.generate('supprimerDumps'),
            method: "post",
            data: {fichier: fichier, type: 'mediatheque'}
        })
            .done(function(){
                element.closest('tr').remove();
            })
    });
});