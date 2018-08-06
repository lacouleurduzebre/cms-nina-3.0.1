$(document).ready(function(){
    /* Initialisation TinyMCE */
    tinymce.init({
        selector: "textarea",
        theme: "modern",
        height: 300,
        plugins: [
            "advlist autolink link image lists charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking spellchecker",
            "table contextmenu directionality emoticons paste textcolor responsivefilemanager code"
        ],
        relative_urls: false,
        menubar: false,

        filemanager_title:"Médiathèque",
        external_filemanager_path:"/filemanager/",
        external_plugins: { "filemanager" : "/filemanager/plugin.min.js"},

        extended_valid_elements: 'i[class]',
        image_advtab: true,
        toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | formatselect",
        toolbar2: "| responsivefilemanager | image | media | link unlink anchor | preview | code"
    });

    /* Toggle colonne de gauche */
    if($.cookie('full') === 'on'){
        $('body').addClass('full');
    }else{
        $('body').addClass('notFull');
    }

    $('#btnArbo').click(function(e){
        e.preventDefault();
        $('body').toggleClass('full');
        $('body').toggleClass('notFull');
        $.cookie('full') === 'on' ? $.cookie('full', 'off') : $.cookie('full', 'on');
    });

    /* Pop-up pour confirmer une suppression */
    $('.action-delete').click(function(e){
        e.preventDefault();
        $('#modal-delete').css('display', 'flex');
    });

    /* Résolution du problème de textarea vide avec tinymce */
    $('.action-save').click(function(){
        tinyMCE.triggerSave();
    });

    /* URL automatique */
    creationURL = function( event ){
        if($('body').hasClass('new')) {
            var caracteresInterdits = new RegExp('[ \'\"]', 'gi');
            var caracteresInutiles = new RegExp('[()]', 'i');
            var e = new RegExp('[éèêëÉÈÊË]', 'gi');
            var a = new RegExp('[àÀ]', 'gi');
            var u = new RegExp('[ùûÛ]', 'u');
            var o = new RegExp('[ôÔ]', 'u');
            var i = new RegExp('[îïÎÏ]', 'i');
            titreOK = $(this).val()
                .replace(caracteresInterdits, '-')
                .replace(caracteresInutiles, '')
                .replace(e, 'e')
                .replace(a, 'a')
                .replace(u, 'u')
                .replace(o, 'o')
                .replace(i, 'i')
                .toLowerCase();
            url = encodeURIComponent(titreOK);
            $(event.data.cible).val(url);
        }
    };

        /* Pour les pages */
        $('#page_active_titre').on('keyup', {
            cible: '#page_active_SEO_url'
        }, creationURL );

        /* Pour les catégories */
        $('#categorie_nom').on('keyup', {
            cible: '#categorie_url'
        }, creationURL );

        /* Pour les types de catégorie */
        $('#typecategorie_nom').on('keyup', {
            cible: '#typecategorie_url'
        }, creationURL );

    /* Méta-titre automatique */
    $('#page_active_titre').on('keyup', function(){
        if($('body').hasClass('new')){
            titre = $(this).val();
            $('#page_active_SEO_metaTitre').val(titre);
        }
    });

    /* Page active colorée dans l'arbo */
    surbrillancePageActive = function(){
        if(!$('body.front').hasClass('connected') && !$('body.easyadmin').hasClass('edit-page_active')) {
            return false;
        }
        if($('body').hasClass('front')){
            idPage = $('main.page').attr('id');
        }else if($('body').hasClass('easyadmin')){
            idPage = $('form').attr('data-entity-id');
        }
        $('.page#'+idPage).parent('a').addClass('page-active');
        $('.page#'+idPage).parents('.jstree').find('li[id$="_1"] > a').addClass('page-active');
    };

    $('.sidebar-menus div[id^="menu"]').on('ready.jstree open_node.jstree move_node.jstree', surbrillancePageActive);

    /* Affichage du formulaire en fonction du type du module */
    $('#edit-page_active-form').on('change', 'select[id^="page_active_modules"]', function(){
        type = $(this).val();
        id = $(this).attr('id');
        idModule = $(this).closest('.field-module').children('label').html();
        $(this).prev('label').append('<i class="fas fa-sync fa-spin module"></i>');

        $.ajax({
            url: Routing.generate('ajouterModule'),
            method: "post",
            data: {type: type}
        })
            .done(function(data){
                $('#'+id).prev('label').find('svg').fadeOut();
                $('#'+id).closest('div[id^="page_active"]').find('div[id$="contenu"]').append(data);
                $('#page_active_modules_'+idModule+'_contenu').find('label').each(function(){
                    idLabel = $(this).attr('for');
                    champ = idLabel.substring(idLabel.indexOf('_') + 1);
                    $(this).attr('for', 'page_active[modules]['+idModule+'][contenu]['+champ+']');
                    $(this).next('*').attr('name', 'page_active[modules]['+idModule+'][contenu]['+champ+']');
                    $(this).next('*').attr('id', $(this).next('*').attr('id')+idModule);
                });
                if(type == 'Image'){
                    url = $('#image_image'+idModule).parent('div').next('div').find('a').attr('href');
                    $('#image_image'+idModule).parent('div').next('div').find('a').attr('href', url+idModule);
                }
                $('#'+id).closest('div').append('<p class="type-module">'+type+'</p>');
                $('#'+id).hide();
                // TinyMCE
                tinymce.remove();
                tinymce.init({
                    selector: "textarea",
                    theme: "modern",
                    height: 300,
                    plugins: [
                        "advlist autolink link image lists charmap print preview hr anchor pagebreak",
                        "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking spellchecker",
                        "table contextmenu directionality emoticons paste textcolor responsivefilemanager code"
                    ],
                    relative_urls: false,
                    menubar: false,

                    filemanager_title:"Médiathèque",
                    external_filemanager_path:"/filemanager/",
                    external_plugins: { "filemanager" : "/filemanager/plugin.min.js"},

                    extended_valid_elements: 'i[class]',
                    image_advtab: true,
                    toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | formatselect",
                    toolbar2: "| responsivefilemanager | image | media | link unlink anchor | preview | code"
                });
            })
            .fail(function(){
                $('#'+id).next('svg').attr('class', 'fas fa-times').css('opacity', 0);
            });
    });

    /* Cacher les select de choix du type de module si module déjà créé */
    $('.form-group.field-module select[id$="type"]').each(function(){
        type = $(this).val();
        $(this).hide().closest('div').append('<p class="type-module">'+type+'</p>');
    });

    /* Changement du h1 lors de l'édition d'une page */
    $('body.edit-page_active h1').html('Page : '+$('#page_active_titre').val());

    $('#page_active_titre').on('keyup', function(){
        $('body.edit-page_active h1').html('Page : '+$(this).val());
    });

    /* Changement couleur BO */
    if($('body').hasClass('edit-utilisateur') || $('body').hasClass('new-utilisateur')){
        couleur = $('#utilisateur_couleurBO').val();
    }
    $('#utilisateur_couleurBO').on('change', function(){
       nouvelleCouleur = $(this).val();
       $('body').removeClass(couleur).addClass(nouvelleCouleur);
       couleur = nouvelleCouleur;
    });

    /* Bouton médiathèque */
    $('.module_image_bouton_mediatheque').fancybox({
        type: 'iframe',
        minHeight: '600'
    });

    function responsive_filemanager_callback(field_id){
        console.log(field_id);
        var url=jQuery('#'+field_id).val();
        alert('update '+field_id+" with "+url);
        //your code
    }

    $(document).on('afterClose.fb', function( e, instance, slide ) {
        console.log(slide);
        id = slide.src.substr(slide.src.indexOf('field_id=')+9);
        console.log(id);
        urlImg = $('#'+id).val();
        console.log(urlImg);
        $('#'+id).parent('div').next('div').find('img').attr('src', urlImg);
    });

    /* Gestion de la position des modules */
    $("#page_active_modules").sortable({
        handle: '.drag',
        update: function(event, ui){
            $('.field-module').each(function(){
                idModule = $(this).find('.control-label').html();
                $(this).find('#page_active_modules_'+idModule+'_position').val($(this).index());
            })
        }
    });

    /* Menu modules */
    $('#page_active_modules').on('click', '.module-menu span', function(){
        $(this).closest('div').toggleClass('actif');
    });
});