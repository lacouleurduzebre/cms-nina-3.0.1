<?php
/**
 * Created by PhpStorm.
 * User: Chipolata
 * Date: 17/12/2018
 * Time: 13:48
 */

namespace App\Blocs\Recherche;


use App\Entity\Bloc;
use App\Entity\Page;
use App\Service\Langue;
use App\Service\Pagination;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class RechercheController extends AbstractController
{
    /**
     * @Route("/recherche/resultats", name="recherche")
     * @Route("/{_locale}/recherche/resultats", name="rechercheLocale", requirements={
     *     "_locale"="^[A-Za-z]{1,2}$"
     * })
     */
    public function rechercheAction(Request $request, Langue $slangue, Pagination $pagination, $_locale = null){
        //Test route : locale ou non
        $redirection = $slangue->redirectionLocale('recherche', $_locale);
        if($redirection){
            return $redirection;
        }

        $recherche = $request->get('recherche');

        $motsCles = explode(' ', $recherche);

        $repoPage = $this->getDoctrine()->getRepository(Page::class);
        $pages = $repoPage->recherche($motsCles);

        $repoBloc = $this->getDoctrine()->getRepository(Bloc::class);
        $blocs = $repoBloc->recherche($motsCles);

        $pages = array_merge($pages, $blocs);

        //Description des pages
        $resumes = [];

        foreach($pages as $page){
            $blocTexte = $repoBloc->premierBloc($page, 'texte');
            $blocParagraphe = $repoBloc->premierBloc($page, 'paragraphe');

            if(!$blocTexte && !$blocParagraphe){
                $resumes[$page->getId()] = false;
            }else{
                if(!$blocTexte){
                    $resume = $blocParagraphe->getContenu()['texte'];
                }elseif(!$blocParagraphe){
                    $resume = $blocTexte->getContenu()['texte'];
                }else{
                    $resume = ($blocTexte->getPosition() < $blocParagraphe->getPosition()) ? $blocTexte->getContenu()['texte'] : $blocParagraphe->getContenu()['texte'];
                }

                $resume = strip_tags($resume);
                $resume = substr($resume, 0, 300).'...';
                $resumes[$page->getId()] = $resume;
            }
        }
        //Description des pages

        //Pagination
        $page = isset($_GET['page']) ? $_GET['page'] : 1;
        $parametres = [
            'pagination' => [
                1
            ],
            'resultatsParPage' => 10
        ];
        $resultats = $pagination->getPagination($pages, $parametres, $page);
        //Pagination

        return $this->render('Blocs/Recherche/ResultatsRecherche.html.twig', array('resultats' => $resultats, 'resumes' => $resumes));
    }
}