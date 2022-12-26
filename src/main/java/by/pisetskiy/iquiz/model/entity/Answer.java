package by.pisetskiy.iquiz.model.entity;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Answer extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Game game;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Question question;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Participant participant;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Variant variant;
    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
}
