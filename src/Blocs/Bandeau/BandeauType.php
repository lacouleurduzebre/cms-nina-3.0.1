<?php
/**
 * Created by PhpStorm.
 * User: Chipolata
 * Date: 13/07/2018
 * Time: 11:45
 */

namespace App\Blocs\Bandeau;


use App\Blocs\Image\ImageType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BandeauType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('image', ImageType::class, array(
                'required' => false,
                'label' => false
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => null,
        ));
    }

    public function getParent(){
        return FormType::class;
    }
}