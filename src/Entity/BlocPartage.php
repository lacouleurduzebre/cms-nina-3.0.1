<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BlocPartageRepository")
 */
class BlocPartage
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     */
    private $nom;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Bloc", inversedBy="blocPartage", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank
     */
    private $bloc;

    public function __toString()
    {
        return $this->nom;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getBloc(): ?Bloc
    {
        return $this->bloc;
    }

    public function setBloc(Bloc $bloc): self
    {
        $this->bloc = $bloc;

        return $this;
    }
}