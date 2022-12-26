package by.pisetskiy.iquiz.model.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Game extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Quiz quiz;
    @Column(nullable = false)
    private String code;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GameState state = GameState.CREATED;
    @Column(columnDefinition = "LONGTEXT")
    private String settings;
    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<Participant> participants = new ArrayList<>();
}
