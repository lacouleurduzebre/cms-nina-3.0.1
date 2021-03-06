$(document).ready(function() {
    /* Gestion de la position des blocs */
    options = {
        handle: '.drag',
        update: function(event, ui){
            $('.field-bloc').each(function(){
                $(this).find("input[id$='position']").val($(this).index());
                saveCloseFormulaire();
            });
            tinymce.remove();
            tinymce.init(optionsTinyMCEParagraphe);
            tinymce.init(optionsTinyMCE);
        }
    };

    $("#page_active_blocs").sortable(options);
    $("#groupeblocs_blocs").sortable(options);
    $("div[id$='blocsEnfants']").sortable(options);

    $(".bloc-slider div[id$='contenu_Slide']").sortable({
        handle: '.dragSlide',
        update: function(event, ui){
            $('.field-slide').each(function(){
                $(this).find("input[id$='position']").val($(this).index());
                saveCloseFormulaire();
            });
        }
    });

    $(".bloc-galerie div[id$='contenu_images']").sortable({
        handle: '.dragGalerie',
        update: function(event, ui){
            $('.field-galerie_image').each(function(){
                $(this).find("input[id$='position']").val($(this).index());
                saveCloseFormulaire();
            });
        }
    });

    $(".bloc-formulaire div[id$='contenu_champs']").sortable({
        handle: '.dragChamp',
        update: function(event, ui){
            $('.field-champ').each(function(){
                $(this).find("input[id$='position']").val($(this).index());
                saveCloseFormulaire();
            });
        }
    });

    $(".bloc-grille div[id$='contenu_cases']").sortable({
        handle: '.dragCase',
        update: function(event, ui){
            $('.field-case').each(function(){
                $(this).find("input[id$='position']").val($(this).index());
                saveCloseFormulaire();
            });
        }
    });

    var optionsSortableAccordeon = {
        handle: '.dragSection',
        update: function(event, ui){
            $('.field-section').each(function(){
                $(this).find("input[id$='position']").val($(this).index());
                saveCloseFormulaire();
            });
            tinymce.remove();
            tinymce.init(optionsTinyMCE);
        }
    };
    var sortableAccordeon = $(".bloc-accordeon div[id$='contenu_sections']");
    sortableAccordeon.sortable(optionsSortableAccordeon);
    $('form').on('click', '.bloc-accordeon .field-collection-action a', function(){
        sortableAccordeon.sortable(optionsSortableAccordeon);
        sortableAccordeon.sortable("refresh");
    });

    /* Menu blocs */
    $('form').on('click', '.bloc-menu', function(e){
        e.stopPropagation();
        $('.bloc-menu').not(this).closest('.bloc-barreActions').removeClass('actif');
        $(this).closest('.bloc-barreActions').toggleClass('actif');
        $(this).closest('div').find('.suppressionBloc').hide();
    });

    $('body').on('click', function(){
        $('.bloc-barreActions').removeClass('actif');
        $('.suppressionBloc').hide();
    });

    /* Monter */
    $('form').on('click', '.monterBloc', function(e){
        e.preventDefault();
        $(this).closest('div').removeClass('actif');

        bloc = $(this).closest('.field-bloc');
        blocPrecedent = bloc.prev('.field-bloc');
        bloc.insertBefore(blocPrecedent);

        tinymce.remove();
        tinymce.init(optionsTinyMCEParagraphe);
        tinymce.init(optionsTinyMCE);

        $('.field-bloc').each(function(){
            $(this).find("input[id$='position']").val($(this).index());
        });
    });

    /* Descendre */
    $('form').on('click', '.descendreBloc', function(e){
        e.preventDefault();
        $(this).closest('div').removeClass('actif');

        bloc = $(this).closest('.field-bloc');
        blocSuivant = bloc.next('.field-bloc');
        bloc.insertAfter(blocSuivant);

        tinymce.remove();
        tinymce.init(optionsTinyMCEParagraphe);
        tinymce.init(optionsTinyMCE);

        $('.field-bloc').each(function(){
            $(this).find("input[id$='position']").val($(this).index());
        });
    });

    /* Options d'affichage */
    $('form').on('click', '.optionsAffichage', function(e){
        e.preventDefault();
        $(this).closest('div').removeClass('actif');

        bloc = $(this).closest('.field-bloc');

        bloc.children('div').children('.bloc-optionsAffichage').toggleClass('actif');
    });

    /* Fermeture */
    $('form').on('click', '.bloc-optionsAffichage-fermeture', function(){
        $(this).closest('div').removeClass('actif');
    });

    /* Supprimer */
    $('form').on('click', '.supprimerBloc', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).next('div').show();
    });

    $('form').on('click', '.suppressionBloc-annuler', function(e){
        e.preventDefault();

        $(this).closest('.suppressionBloc').hide().closest('.bloc-menu').removeClass('actif');
    });

    $('form').on('click', '.suppressionBloc-supprimer', function(e){
        e.preventDefault();

        if(count === 0){
            entite = $('.listeBlocs').siblings('form').attr('name');
            count = $('#'+entite+'_blocs').find('.field-bloc').length;
        }

        $(this).closest('.field-bloc').fadeTo(500, 0, function(){
            $(this).slideUp(300, function(){
                $(this).remove();
            });
            saveCloseFormulaire();
        });

        //Bloc enfant
        if($(this).closest('.blocsEnfants').length > 0){
            input = $(this).closest('.contenu').find('input[name$="[colonnes]"]:checked');
            verifNombreBlocs(input, 'suppression');
        }
    });

    $('form').on('click', '.suppressionBlocAnnexe-supprimer', function(e){
        e.preventDefault();

        if(count === 0){
            count = $('#page_active_blocsAnnexes').find('.field-bloc_annexe').length;
        }

        $(this).closest('.field-bloc_annexe').fadeTo(500, 0, function(){
            $(this).slideUp(300, function(){
                $(this).remove();
            });
            saveCloseFormulaire();
        });

        type = $(this).closest('.field-bloc_annexe').find('.type input').val();
        $('#'+type).removeClass('disabled');
    });

    //Ajout de blocs via liste des blocs
    $('.listeBlocs li').click(function(){
        type = $(this).attr('id');
        $('.listeBlocs').addClass('chargement');
        entite = $('.listeBlocs').siblings('form').attr('name');

        $.ajax({
            url: Routing.generate('ajouterBloc'),
            method: "post",
            data: {type: type, typeBloc: 'Bloc'}
        })
            .done(function(data){
                saveCloseFormulaire();

                $('.listeBlocs').removeClass('actif chargement');

                if($('.listeBlocs').attr('id') === 'avant' || $('.listeBlocs').attr('id') === 'apres'){
                    if(count === 0){
                        count = $('#'+entite+'_blocs').find('.field-bloc').length;
                    }else{
                        count++;
                    }

                    var form = data.replace(/bloc_/g, entite+'_blocs_'+count+'_')
                        .replace(/bloc\[/g, entite+'[blocs]['+count+'][');

                    bloc = '<div id="nvBloc'+count+'" class="form-group field-bloc nvBloc" data-name="'+count+'">'+form+'</div>';
                    if($('.listeBlocs').attr('id') === 'apres'){
                        $('#'+entite+'_blocs').append(bloc);
                    }else{
                        $('#'+entite+'_blocs').prepend(bloc);
                    }
                }else{//Bloc enfant
                    section = $('#'+$('.listeBlocs').attr('data-section'));

                    count = section.closest('.field-bloc').data('name');
                    countBloc = section.find('.field-bloc').length;

                    exp = entite+'['+$('.listeBlocs').attr('data-section').replace(entite+'_', '').replace(/_/g, '][')+']';

                    var form = data.replace(/bloc_/g, $('.listeBlocs').attr('data-section')+'_'+countBloc+'_')
                        .replace(/bloc\[/g, exp+'['+countBloc+'][');

                    bloc = '<div id="nvBloc'+countBloc+'" class="form-group field-bloc" data-name="'+countBloc+'">'+form+'</div>';
                    section.append(bloc);

                    section.closest('.contenu').find('input[name$="[colonnes]"]').each(function(){
                        if($(this).prop('checked')){
                            verifNombreBlocs($(this));
                        }
                    });
                }

                //Anim ajout de bloc
                $('.field-bloc').removeClass('focus');

                if($('.listeBlocs').attr('id') === 'avant' || $('.listeBlocs').attr('id') === 'apres'){
                    nvBloc = $('#nvBloc'+count);
                    nvBloc.addClass('focus');

                    var elOffset = nvBloc.offset().top;
                    var elHeight = nvBloc.height();
                    var windowHeight = $(window).height();

                    if (elHeight < windowHeight) {
                        offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
                    }
                    else {
                        offset = elOffset;
                    }

                    $('body, html').animate({
                        scrollTop: offset
                    }, 600, 'swing', function(){
                        nvBloc.fadeTo(600, 1);
                    });

                    $('#'+entite+'_blocs').prev('.empty').remove();
                }

                $('.field-bloc').each(function(){
                    $(this).find("input[id$='position']").val($(this).index());
                });

                tinymce.remove();
                tinymce.init(optionsTinyMCEParagraphe);
                tinymce.init(optionsTinyMCE);
                $('.select-multiple').select2();
            })
            .fail(function(){
                $('.listeBlocs').removeClass('actif chargement');
            });
    });

    //Ajout de blocs annexes via liste des blocs
    $('.listeBlocsAnnexes li').click(function(){
        if(!$(this).hasClass('disabled')) {
            btnAjoutBloc = $(this);

            type = $(this).attr('id');
            $('.listeBlocsAnnexes').addClass('chargement');

            $.ajax({
                url: Routing.generate('ajouterBloc'),
                method: "post",
                data: {type: type, typeBloc: 'BlocAnnexe'}
            })
                .done(function (data) {
                    saveCloseFormulaire();

                    $('.listeBlocsAnnexes').removeClass('actif chargement');

                    if(count === 0){
                        count = $('#page_active_blocsAnnexes').find('.field-bloc_annexe').length;
                    }else{
                        count++;
                    }

                    var form = data.replace(/bloc_annexe_/g, 'page_active_blocsAnnexes_' + count + '_')
                        .replace(/bloc_annexe\[/g, 'page_active[blocsAnnexes][' + count + '][');

                    bloc = '<div id="nvBlocAnnexe' + count + '" class="form-group field-bloc_annexe nvBloc">' + form + '</div>';
                    if ($('.listeBlocsAnnexes').attr('id') === 'apres') {
                        $('#page_active_blocsAnnexes').append(bloc);
                    } else {
                        $('#page_active_blocsAnnexes').prepend(bloc);
                    }

                    //Anim ajout de bloc
                    $('.field-bloc_annexe').removeClass('focus');
                    nvBloc = $('#nvBlocAnnexe'+count);
                    nvBloc.addClass('focus');

                    var elOffset = nvBloc.offset().top;
                    var elHeight = nvBloc.height();
                    var windowHeight = $(window).height();

                    if (elHeight < windowHeight) {
                        offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
                    }
                    else {
                        offset = elOffset;
                    }

                    $('body, html').animate({
                        scrollTop: offset
                    }, 600, 'swing', function(){
                        nvBloc.fadeTo(600, 1);
                    });
                    //

                    $('#page_active_blocsAnnexes').prev('.empty').remove();

                    $('.field-blocAnnexe').each(function () {
                        $(this).find("input[id$='position']").val($(this).index());
                    });

                    tinymce.remove();
                    tinymce.init(optionsTinyMCEParagraphe);
                    tinymce.init(optionsTinyMCE);

                    $('#'+type).addClass('disabled');
                })
                .fail(function () {
                    $('.listeBlocsAnnexes').removeClass('actif chargement');
                });
        }
    });

    //Fermeture
    $('.listeBlocs-fermeture').click(function(){
        $('.listeBlocs').removeClass('actif');
        $('.voirBlocs').removeClass('hidden');
    });

    $('.listeBlocsAnnexes-fermeture').click(function(){
        $('.listeBlocsAnnexes').removeClass('actif');
        $('.voirBlocs').removeClass('hidden');
    });

    //Bloc groupe de blocs : modif du lien si valeur qui change
    $('.bloc-groupeblocs-edition select').on('change', function(){
        $(this).next('a').attr('href', Routing.generate('admin', { action: 'edit', entity: 'GroupeBlocs', id: $(this).val() }));
    });

    //Toggle blocs - pages
    $('#page_active_blocs').on('click', '.toggleBloc', function(){
        $(this).closest('.form-group').find('.contenu').children('div').toggleClass('hide');
        $(this).toggleClass('rotate');

        if($('#page_active_blocs').find('.toggleBloc:not(.rotate)').length === 0){//Si tous les blocs sont fermés, "déplier les blocs"
            $('#deplierBlocs').show();
            $('#replierBlocs').hide();
        }else if($('#page_active_blocs').find('.toggleBloc.rotate').length === 0){//Si tous les blocs sont ouverts, "replier les blocs"
            $('#replierBlocs').show();
            $('#deplierBlocs').hide();
        }
    });

    //Toggle blocs - groupes de blocs
    $('#groupeblocs_blocs').on('click', '.toggleBloc', function(){
        $(this).closest('.form-group').find('.contenu').children('div').toggleClass('hide');
        $(this).toggleClass('rotate');

        if($('#groupeblocs_blocs').find('.toggleBloc:not(.rotate)').length === 0){//Si tous les blocs sont fermés, "déplier les blocs"
            $('#deplierBlocs').show();
            $('#replierBlocs').hide();
        }else if($('#groupeblocs_blocs').find('.toggleBloc.rotate').length === 0){//Si tous les blocs sont ouverts, "replier les blocs"
            $('#replierBlocs').show();
            $('#deplierBlocs').hide();
        }
    });

    //Mise en avant du bloc en cours d'édition
    $('#page_active_blocs, #groupeblocs_blocs, #page_active_blocsAnnexes').on('click', '.field-bloc', function(){
        if(!$(this).hasClass('focus')){
            $('.field-bloc').removeClass('focus');
            $(this).addClass('focus');
        }
    });

    $('#page_active_blocs, #groupeblocs_blocs, #page_active_blocsAnnexes').on('click', '.field-bloc_annexe', function(){
        if(!$(this).hasClass('focus')){
            $('.field-bloc_annexe').removeClass('focus');
            $(this).addClass('focus');
        }
    });

    //Bloc formulaire : affichage ou non des choix
    $('#page_active_blocs').on('change', '.bloc-formulaire select[id$="type"]', function(){
        if($(this).val() === 'select' || $(this).val() === 'radio' || $(this).val() === 'checkbox'){
            $(this).closest('div').siblings('.field-choix').slideDown();
        }else{
            $(this).closest('div').siblings('.field-choix').slideUp().find('div[id$="choix"]').remove();
        }
    });

    //Déplier / replier tous les blocs
    toggleBlocs = function(elem, action){
        actionInverse = (action === 'r') ? 'd' : 'r';
        elem.closest('.form-group').find('.contenu').each(function(){
            if(action === 'r'){
                rotate = !$(this).children('div').hasClass('hide');
                $(this).children('div').addClass('hide');
            }else{
                rotate = $(this).children('div').hasClass('hide');
                $(this).children('div').removeClass('hide');
            }
            if(rotate){
                $(this).closest('.field-bloc').find('.toggleBloc').toggleClass('rotate');
            }
        });
        elem.hide();
        $('#'+actionInverse+'eplierBlocs').show();
    };

    $('#replierBlocs').click(function(e){
        e.preventDefault();
        toggleBlocs($(this), 'r');
    });

    $('#deplierBlocs').click(function(e){
        e.preventDefault();
        toggleBlocs($(this), 'd');
    });

    //Activation / désactivation des blocs
    $('#page_active_blocs, #groupeblocs_blocs').on('change', 'input[id$="_active"]', function(){
        if($(this).prop('checked')){
            $(this).closest('.field-bloc').removeClass('desactive');
        }else{
            $(this).closest('.field-bloc').addClass('desactive');
        }
    });

    //Bloc actif
    get = parseURLParams(location.href);
    if(get.blocActif){
        $('#page_active_blocs .contenu').not('[data-bloc="'+get.blocActif[0]+'"]').addClass('hide');

        bloc = $('[data-bloc="'+get.blocActif[0]+'"]');

        bloc.closest('.field-bloc').addClass('focus');

        var elOffset = bloc.offset().top;
        var elHeight = bloc.height();
        var windowHeight = $(window).height();

        if (elHeight < windowHeight) {
            offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
        }
        else {
            offset = elOffset;
        }

        $('body, html').animate({
            scrollTop: offset - 100
        }, 600, 'swing');
    }

    //Clic sur fond de la liste des blocs = fermeture
    $('.listeBlocs li, .listeBlocsAnnexes li').click(function(e){
        e.stopPropagation();
        $(this).siblings('li.blocCache').addClass('hidden');
        $('.voirBlocs').removeClass('hidden');
    });

    $('.listeBlocs, .listeBlocsAnnexes').click(function(){
        $(this).removeClass('actif');
        $(this).find('li.blocCache').addClass('hidden');
        $('.voirBlocs').removeClass('hidden');
    });

    //Liens
    $('body').on('change', 'input[name$="[typeLien]"]', function(){
        conteneur = $(this).closest('.lien-page');

        if($(this).val() === 'page' || $(this).val() === 'autre') {
            conteneur.find('.lien-page--blank').removeClass('hidden');
            if($(this).val() === 'page'){
                conteneur.find('.page').removeClass('hidden');
                conteneur.find('.autre').addClass('hidden').find('input').val('');
            }else{
                conteneur.find('.page').addClass('hidden').find('select').val('');
                conteneur.find('.autre').removeClass('hidden');
            }
        }else{
            conteneur.find('.page').addClass('hidden').find('select').val('');
            conteneur.find('.autre').addClass('hidden').find('input').val('');
            conteneur.find('.lien-page--blank').addClass('hidden');
        }

        conteneur.find('.lien-page--blank').find('input').prop('checked', false);
    });

    $('input[name$="[typeLien]"]').each(function(){
        conteneur = $(this).closest('.lien-page');

        if($(this).prop('checked') && $(this).val() === 'page'){
            conteneur.find('.page').removeClass('hidden');
            conteneur.find('.lien-page--blank').removeClass('hidden');
        }else if($(this).prop('checked') && $(this).val() === 'autre'){
            conteneur.find('.autre').removeClass('hidden');
            conteneur.find('.lien-page--blank').removeClass('hidden');
        }
    });

    //Bloc grille : type d'infos
    $('body').on('change', '.case-choix input', function(){
        conteneur = $(this).closest('.field-case');

        if($(this).val() === 'page'){
            conteneur.find('.case-page').removeClass('hidden');
            conteneur.find('.case-autre').addClass('hidden');
        }else{
            conteneur.find('.case-page').addClass('hidden');
            conteneur.find('.case-autre').removeClass('hidden');
        }
    });

    $('.case-choix input').each(function(){
        conteneur = $(this).closest('.field-case');

        if($(this).prop('checked') && $(this).val() === 'page'){
            conteneur.find('.case-page').removeClass('hidden');
        }else if($(this).prop('checked') && $(this).val() === 'autre'){
            conteneur.find('.case-autre').removeClass('hidden');
        }
    });

    //Aperçu du bloc vidéo
    $('body').on('keyup', '.bloc-video input[name$="[video]"]', function() {
        urlVideo = $(this).val();
        if (urlVideo.includes('youtube') || urlVideo.includes('youtu.be')) {
            if (urlVideo.includes('?v=')) {
                urlVideo = urlVideo.split('?v=').pop();
            } else {
                urlVideo = urlVideo.split('/').pop();
            }
            urlVideo = "https://www.youtube.com/embed/" + urlVideo + "?rel=0";
        }
        $(this).closest('.contenu').find('iframe').show().attr('src', urlVideo);
    });

    //Section : changement du nombre de colonnes
    verifNombreBlocs = function(input, contexte){
        val = input.val();

        max = 2;

        if(val === '1'){
            max = 0;
        }else if (val === '3' || val === '4'){
            max = parseInt(val);
        }

        conteneurBlocsEnfants = input.closest('.contenu').children('.blocsEnfants');
        blocsEnfants = conteneurBlocsEnfants.children('div').children('.field-bloc');
        nbBlocsEnfants = blocsEnfants.length;

        if(contexte === 'suppression'){
            nbBlocsEnfants -= 1;
        }

        if(max !== 0 && nbBlocsEnfants >= max){
            //Désactivation bouton d'ajout de bloc
            conteneurBlocsEnfants.children('.field-collection-action').children('.ajout-bloc').attr('disabled', true);

            if(max !== 0 && nbBlocsEnfants > max){
                if(confirm('Il y a plus de blocs que de colonnes. Les blocs supplémentaires vont être supprimés. Continuer ?')){
                    //Suppression des blocs en trop
                    blocsEnfants.each(function(){
                        if($(this).index() >= max){
                            $(this).remove();
                        }
                    });

                    input.closest('.contenu').find('.blocsEnfants').attr('data-col', 'col'+input.val());
                    input.closest('.form-group').attr('data-val', input.val());
                }else{
                    valPrecedente = input.closest('.form-group').attr('data-val');
                    input.closest('.form-group').find('input[value="'+valPrecedente+'"]').click();
                }
            }else{
                input.closest('.contenu').find('.blocsEnfants').attr('data-col', 'col'+input.val());
                input.closest('.form-group').attr('data-val', input.val());
            }
        }else{
            //Activation bouton d'ajout de bloc
            conteneurBlocsEnfants.children('.field-collection-action').children('.ajout-bloc').attr('disabled', false);
            input.closest('.contenu').find('.blocsEnfants').attr('data-col', 'col'+input.val());
            input.closest('.form-group').attr('data-val', input.val());
        }
    };

    $('body').on('change', 'input[name$="[colonnes]"]', function(){
        verifNombreBlocs($(this));
    });

    $('input[name$="[colonnes]"]').each(function(){
        if($(this).prop('checked')){
            verifNombreBlocs($(this));
        }
    });

    //Voir tous les blocs
    $('.voirBlocs').click(function(e){
        e.stopPropagation();
        $(this).addClass('hidden');
        $(this).prev('ul').find('.blocCache').removeClass('hidden');
    });

    //Bloc réseaux sociaux : type d'utilisation (liens / partage)
    $('body').on('change', 'input[name$="[typeRS]"]', function(){
        conteneur = $(this).closest('.contenu');

        if($(this).val() === 'partage') {
            conteneur.find('.rs-input-partage').removeClass('hidden');
            conteneur.find('.rs-input-liens').addClass('hidden');
        }else{
            conteneur.find('.rs-input-partage').removeClass('hidden');
            conteneur.find('.rs-input-liens').removeClass('hidden');
        }
    });

    //Bloc LEI
        //Toggle champ flux spécifique
    $('body').on('change', 'input[name*="[utiliserFluxSpecifique]"]', function(){
       $(this).closest('.form-group').next('div').slideToggle();
    });

        //Toggle champ recherche par critères
    $('body').on('change', '.bloc-lei input[name$="[recherche]"]', function(){
        if($(this).val() === 'criteres'){
            $(this).closest('.form-group').next('div').slideDown();
        }else{
            $(this).closest('.form-group').next('div').slideUp();
        }
    });

        //Màj de l'url du bouton "voir le flux"
    $('body').on('keyup change', 'input[name$="[fluxGenerique]"], input[name*="[utiliserFluxSpecifique]"], input[name$="[flux]"], input[name$="[clause]"], input[name$="[autresParametres]"]', function(){
        blocLEI = $(this).closest('.bloc-lei');

        //Flux générique ou spécifique
        if(blocLEI.find('input[name*="[utiliserFluxSpecifique]"]').is(':checked') && blocLEI.find('input[name$="[flux]"]').val() !== ''){
            nvUrlFlux = blocLEI.find('input[name$="[flux]"]').val();
        }else{
            nvUrlFlux = blocLEI.find('input[name$="[fluxGenerique]"]').val();
        }

        //Ajout de la clause et des autres paramètres
        nvUrlFlux += '&clause='+blocLEI.find('input[name$="[clause]"]').val()+blocLEI.find('input[name$="[autresParametres]"]').val();

        blocLEI.find('.voirFlux').attr('href', nvUrlFlux);
    });

        //Vider le cache
    $('body').on('click', '.viderCacheLEI', function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/admin/LEI/viderCache",
            success: function()
            {
                $('#flash-messages').append("<div class='alert alert-enregistrement'><span>Les fichiers de cache LEI ont été vidés</span><i class='fas fa-times'></i></div>");

                setTimeout(function(){
                    $('.alert').fadeOut();
                }, 3000);
            }
        });
    });
});